// Função para salvar pessoas no localStorage
function salvarPessoas(pessoas) {
    localStorage.setItem('pessoas', JSON.stringify(pessoas));
}

// Função para obter pessoas do localStorage
function obterPessoas() {
    const pessoas = localStorage.getItem('pessoas');
    return pessoas ? JSON.parse(pessoas) : [];
}

// Função para adicionar uma nova pessoa
function adicionarPessoa(nome, idade) {
    const pessoas = obterPessoas();
    const novaPessoa = { id: Date.now(), nome, idade };
    pessoas.push(novaPessoa);
    salvarPessoas(pessoas);
    return novaPessoa;
}

// Função para remover uma pessoa
function removerPessoa(id) {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter esta ação!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#33AEB2',
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const pessoas = obterPessoas();
            const pessoasFiltradas = pessoas.filter(pessoa => pessoa.id !== id);
            salvarPessoas(pessoasFiltradas);
            
            Swal.fire(
                'Removido!',
                'A pessoa foi removida com sucesso.',
                'success'
            ).then(() => {
                renderizarLista();
            });
        }
    });
}

// Função para atualizar uma pessoa
function atualizarPessoa(id, nome, idade) {
    const pessoas = obterPessoas();
    const index = pessoas.findIndex(pessoa => pessoa.id === id);
    if (index !== -1) {
        pessoas[index] = { ...pessoas[index], nome, idade };
        salvarPessoas(pessoas);
    }
}

// Função para renderizar a lista de pessoas
function renderizarLista() {
    const listaPessoas = document.getElementById('listaPessoas');
    if (listaPessoas) {
        const pessoas = obterPessoas();
        listaPessoas.innerHTML = pessoas.map(pessoa => `
            <li>
                Nome: ${pessoa.nome} - Idade: ${pessoa.idade} anos
                <div class="acoes">
                    <button onclick="editarPessoa(${pessoa.id})">Editar</button>
                    <button onclick="removerPessoa(${pessoa.id})">Remover</button>
                </div>
            </li>
        `).join('');
    }
}

// Função para editar uma pessoa
function editarPessoa(id) {
    window.location.href = `editar.html?id=${id}`;
}

// Evento de submissão do formulário de cadastro
const cadastroForm = document.getElementById('cadastroForm');
if (cadastroForm) {
    cadastroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const idade = document.getElementById('idade').value;
        if (nome && idade) {
            adicionarPessoa(nome, parseInt(idade));
            cadastroForm.reset();
            Swal.fire({
                title: 'Sucesso!',
                text: 'Pessoa cadastrada com sucesso!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                title: 'Erro!',
                text: 'Por favor, preencha todos os campos.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
}

// Evento de submissão do formulário de edição
const editarForm = document.getElementById('editarForm');
if (editarForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    const pessoas = obterPessoas();
    const pessoa = pessoas.find(p => p.id === id);

    if (pessoa) {
        document.getElementById('nome').value = pessoa.nome;
        document.getElementById('idade').value = pessoa.idade;
    }

    editarForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const idade = document.getElementById('idade').value;
        if (nome && idade) {
            atualizarPessoa(id, nome, parseInt(idade));
            Swal.fire({
                title: 'Sucesso!',
                text: 'Pessoa atualizada com sucesso!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = 'tabelaCadastro.html';
            });
        } else {
            Swal.fire({
                title: 'Erro!',
                text: 'Por favor, preencha todos os campos.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
}

// Renderizar a lista de pessoas ao carregar a página de visualização
if (window.location.pathname.includes('tabelaCadastro.html')) {
    window.addEventListener('load', renderizarLista);
}