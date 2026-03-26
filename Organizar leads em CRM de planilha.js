function distribuirLeads() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Função interna para encontrar a aba mesmo com espaços extras no nome
  const getSheet = (name) => {
    return ss.getSheets().find(s => s.getName().trim() === name.trim());
  };

  const abaOrigem = getSheet(""); //Aqui é onde o meta vai sincronizar os formularios, então o nome da aba deve ser exatamente igual ao que o meta cria (normalmente "Dados Brutos" ou algo similar)
  const abaCRM    = getSheet(""); //Aqui é onde os leads vão para o CRM, então o nome da aba deve ser exatamente igual ao que o CRM espera (normalmente "CRM" ou algo similar)
  const abaBanco  = getSheet(""); //Aqui é onde os leads vão para o Banco de Dados, então o nome da aba deve ser exatamente igual ao que o Banco de Dados espera (normalmente "Banco de Dados" ou algo similar)

  if (!abaOrigem || !abaCRM || !abaBanco) {
    SpreadsheetApp.getUi().alert("Erro: Certifique-se que as abas se chamam: 'Dados Brutos', 'CRM' e 'Banco de Dados'");
    return;
  }

  const ultimaLinhaOrigem = abaOrigem.getLastRow();
  if (ultimaLinhaOrigem < 2) return;

  const intervaloOrigem = abaOrigem.getRange(2, 1, ultimaLinhaOrigem - 1, 17);
  const dadosGerais = intervaloOrigem.getValues();
  const dataAtual = Utilities.formatDate(new Date(), "GMT-3", "dd/MM");

  dadosGerais.forEach(function(linha) {
    // 1. COPIA PARA O BANCO DE DADOS (Cópia fiel da linha)
    abaBanco.appendRow(linha);

    // 2. MAPEAMENTO CORRIGIDO (Baseado no seu print N12 da aba Dados Brutos)
    // M (12) = Capital | N (13) = Nome Completo | O (14) = Telefone | P (15) = Email
    const capital  = linha[12]; 
    const nome     = linha[13]; 
    const telefone = linha[14]; 
    const email    = linha[15]; 

    if (nome && nome !== "") {
      // Limpeza de campos de teste do Facebook
      let nomeLimpo = nome.toString().replace("<test lead: dummy data for ", "").replace(">", "").replace("nome_completo", "Lead Teste");
      let foneLimpo = telefone.toString().replace("p:", "").replace("<test lead: dummy data for ", "").replace(">", "").replace("telefone", "");

      // Envia para o CRM seguindo a ordem das suas colunas:
      // A=Cliente | B=Capital | C=E-mail | D=Telefone | E=Data | F=Estágio...
      abaCRM.appendRow([
        nomeLimpo,      // Coluna A
        capital,        // Coluna B
        email,          // Coluna C
        foneLimpo,      // Coluna D
        dataAtual,      // Coluna E
        "Novo Lead",    // Coluna F
        "", "", "", "", "", // G a K (Vazios para preenchimento manual)
        "Formulario"    // Coluna L
      ]);
    }
  });

  // Limpa os dados brutos para não processar os mesmos leads novamente
  intervaloOrigem.clearContent();
}