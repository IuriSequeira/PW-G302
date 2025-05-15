document.querySelector('.contact-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const nome = document.getElementById('fullName').value.trim();
  const email = document.getElementById('emailAddress').value.trim();
  const assunto = document.getElementById('subject').value.trim();
  const mensagem = document.getElementById('message').value.trim();

  if (!nome || !email || !assunto || !mensagem) {
    alert('Por favor preencha todos os campos.');
    return;
  }

  const novoPedido = {
    nome,
    email,
    assunto,
    mensagem,
    data: new Date().toLocaleString(),
    estado: "A Rever"
  };

  const pedidos = JSON.parse(localStorage.getItem('pedidosAjuda')) || [];

  const jaExiste = pedidos.some(p => 
    p.nome === nome && 
    p.email === email && 
    p.assunto === assunto && 
    p.mensagem === mensagem
  );

  if (jaExiste) {
    alert('Este pedido já foi submetido.');
    return;
  }

  pedidos.push(novoPedido);
  localStorage.setItem('pedidosAjuda', JSON.stringify(pedidos));

  alert('Mensagem enviada com sucesso!');
  this.reset();
});
