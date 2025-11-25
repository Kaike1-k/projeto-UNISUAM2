document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('register-form');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formFields = {
            name: document.getElementById('reg-name').value,
            birth_date: document.getElementById('reg-birth').value,
            gender: document.getElementById('reg-gender').value,
            mother_name: document.getElementById('reg-mother').value,
            cpf: document.getElementById('reg-cpf').value,
            email: document.getElementById('reg-email').value,
            phone: document.getElementById('reg-phone').value,
            cep: document.getElementById('reg-cep').value,
            address: document.getElementById('reg-address').value,
            login: document.getElementById('reg-login').value,
            password: document.getElementById('reg-password').value,
            confirmPassword: document.getElementById('reg-confirm-password').value
        };

        // ======= VALIDAÇÕES =======

        if (formFields.name.length < 15 || formFields.name.length > 80) {
            showToast('Nome deve ter entre 15 e 80 caracteres', 'error');
            return;
        }

        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formFields.name)) {
            showToast('Nome deve conter apenas letras', 'error');
            return;
        }

        if (!validateCPF(formFields.cpf)) {
            showToast('CPF inválido', 'error');
            return;
        }

        if (formFields.login.length !== 6 || !/^[a-zA-Z]+$/.test(formFields.login)) {
            showToast('Login deve ter exatamente 6 letras', 'error');
            return;
        }

        if (formFields.password.length !== 8 || !/^[a-zA-Z]+$/.test(formFields.password)) {
            showToast('Senha deve ter exatamente 8 letras', 'error');
            return;
        }

        if (formFields.password !== formFields.confirmPassword) {
            showToast('Senhas não coincidem', 'error');
            return;
        }

        if (users.find(u => u.login === formFields.login)) {
            showToast('Login já existe', 'error');
            return;
        }

        if (users.find(u => u.cpf === formFields.cpf)) {
            showToast('CPF já cadastrado', 'error');
            return;
        }

        // ================= SALVAR LOCAL =================
        const newUser = {
            id: users.length + 1,
            ...formFields,
            password: btoa(formFields.password),
            role: 'common'
        };
        delete newUser.confirmPassword;

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        showToast('Usuário cadastrado com sucesso!', 'success');


        // ================= ENVIAR PARA O PHP ================
        const phpFormData = new FormData(form); // pega os campos COM name

        fetch("cadastro.php", {
            method: "POST",
            body: phpFormData
        })
        .then(r => r.text())
        .then(retorno => {
            console.log("PHP respondeu:", retorno);
        })
        .catch(err => console.error("Erro ao enviar para o PHP:", err));


        // Troca de tela
        setTimeout(() => showLogin(), 1200);
    });

});