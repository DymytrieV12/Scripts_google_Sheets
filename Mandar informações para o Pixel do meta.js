function myFunction() {
  // --- CONFIGURAÇÕES DO META ---
const FACEBOOK_ACCESS_TOKEN = ''; //Aqui adicione o token de acesso do Meta Pixel
const PIXEL_ID = ''; //Aqui adicione o ID do seu Pixel

function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  const statusSelecionado = e.value;
  
  // Ajustado para o nome da aba que aparece no seu print
  if (sheet.getName() !== "CRM") return; 
  
  // Coluna F (6) é o "Estagio do Lead"
  if (range.getColumn() === 6) {
    const linha = range.getRow();
    // Pega até a coluna K (11) para a trava de segurança
    const dados = sheet.getRange(linha, 1, 1, 11).getValues()[0]; 
    
    const email = dados[2];      // Coluna C
    const telefone = dados[3];   // Coluna D
    const valorVenda = dados[6]; // Coluna G
    const registroEnvio = dados[10] || ""; // Coluna K (Trava)

    // Evento Reunião
    if (statusSelecionado === "Reunião") {
      if (registroEnvio.includes("Reunião Enviada")) return;
      enviarParaMetaCAPI(email, telefone, 0, "Schedule", linha, sheet, "Reunião Enviada ✅");
    }

    // Evento Compra (Sem acento conforme o print: "Negocio Fechado")
    if (statusSelecionado === "Negocio Fechado") {
      if (registroEnvio.includes("Venda Enviada")) return;
      
      if (!valorVenda || valorVenda <= 0) {
        Browser.msgBox("Atenção: Preencha o Valor da Negociação (Coluna G) antes de marcar Fechado.");
        return;
      }
      enviarParaMetaCAPI(email, telefone, valorVenda, "Purchase", linha, sheet, "Venda Enviada ✅");
    }
  }
}

// Funções de suporte (enviarParaMetaCAPI e sha256_) permanecem as mesmas
}
