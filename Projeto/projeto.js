 // ===== VARIÁVEIS GLOBAIS =====
        let currentUser = null; // Usuário logado atualmente
        let currentScreen = 'login'; // Tela atual sendo exibida
        let twoFAAttempts = 3; // Tentativas restantes do 2FA
        let twoFAQuestion = ''; // Pergunta atual do 2FA
        let twoFAAnswer = ''; // Resposta esperada do 2FA
        let currentFontSize = 'normal'; // Tamanho atual da fonte

        // ===== GERENCIAMENTO DE TEMA E FONTE =====
        
        /**
         * Alterna entre modo claro e escuro
         */
        function toggleDarkMode() {
            const body = document.body;
            const themeIcon = document.getElementById('theme-icon');
            
            if (body.classList.contains('dark-theme')) {
                // Muda para tema claro
                body.classList.remove('dark-theme');
                themeIcon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'light');
            } else {
                // Muda para tema escuro
                body.classList.add('dark-theme');
                themeIcon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'dark');
            }
        }

        /**
         * Aumenta o tamanho da fonte
         */
        function increaseFontSize() {
            const body = document.body;
            const sizes = ['small', 'normal', 'large', 'xl'];
            const currentIndex = sizes.indexOf(currentFontSize);
            
            if (currentIndex < sizes.length - 1) {
                body.classList.remove(`font-${currentFontSize}`);
                currentFontSize = sizes[currentIndex + 1];
                body.classList.add(`font-${currentFontSize}`);
                localStorage.setItem('fontSize', currentFontSize);
            }
        }

        /**
         * Diminui o tamanho da fonte
         */
        function decreaseFontSize() {
            const body = document.body;
            const sizes = ['small', 'normal', 'large', 'xl'];
            const currentIndex = sizes.indexOf(currentFontSize);
            
            if (currentIndex > 0) {
                body.classList.remove(`font-${currentFontSize}`);
                currentFontSize = sizes[currentIndex - 1];
                body.classList.add(`font-${currentFontSize}`);
                localStorage.setItem('fontSize', currentFontSize);
            }
        }

        /**
         * Carrega as preferências salvas do usuário
         */
        function loadPreferences() {
            const savedTheme = localStorage.getItem('theme');
            const savedFontSize = localStorage.getItem('fontSize');
            
            // Aplica tema salvo
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-theme');
                document.getElementById('theme-icon').className = 'fas fa-sun';
            }
            
            // Aplica tamanho de fonte salvo
            if (savedFontSize && ['small', 'normal', 'large', 'xl'].includes(savedFontSize)) {
                const body = document.body;
                body.classList.remove('font-normal');
                body.classList.add(`font-${savedFontSize}`);
                currentFontSize = savedFontSize;
            }
        }

        // ===== BANCO DE DADOS SIMULADO =====
        
        /**
         * Array de usuários do sistema
         */
        const users = [
            {
                id: 1,
                name: 'adm monstro',
                birth_date: '1990-01-01',
                gender: 'M',
                mother_name: 'Mamae Silva',
                cpf: '123.456.789-00',
                email: 'admin@sistema.com',
                phone: '(+55)11-999999999',
                address: 'Rua Principal, 123, São Paulo, SP',
                cep: '01234-567',
                login: 'master',
                password: btoa('admin123'), // Senha codificada em Base64
                role: 'master'
            }
        ];

        /**
         * Array de logs de autenticação
         */
        const logs = [];

        // ===== FUNÇÕES UTILITÁRIAS =====
        
        /**
         * Exibe uma notificação toast
         * @param {string} message - Mensagem a ser exibida
         * @param {string} type - Tipo da notificação (success, error, warning, info)
         */
        function showToast(message, type = 'info') {
            const toastContainer = document.getElementById('toast-container');
            
            // Define as classes CSS baseadas no tipo
            const typeClasses = {
                success: 'text-bg-success',
                error: 'text-bg-danger',
                warning: 'text-bg-warning',
                info: 'text-bg-info'
            };
            
            // Define os ícones baseados no tipo
            const typeIcons = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle',
                warning: 'fa-exclamation-triangle',
                info: 'fa-info-circle'
            };
            
            // Cria o elemento toast
            const toastElement = document.createElement('div');
            toastElement.className = `toast ${typeClasses[type] || typeClasses.info}`;
            toastElement.setAttribute('role', 'alert');
            
            toastElement.innerHTML = `
                <div class="toast-header">
                    <i class="fas ${typeIcons[type] || typeIcons.info} me-2"></i>
                    <strong class="me-auto">Sistema</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">${message}</div>
            `;
            
            // Adiciona o toast ao container
            toastContainer.appendChild(toastElement);
            
            // Inicializa e exibe o toast
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
            
            // Remove o elemento após ser ocultado
            toastElement.addEventListener('hidden.bs.toast', () => {
                toastElement.remove();
            });
        }

        /**
         * Exibe um modal de confirmação
         * @param {string} title - Título do modal
         * @param {string} content - Conteúdo do modal
         * @param {Array} buttons - Array de objetos com configurações dos botões
         */
        function showModal(title, content, buttons = []) {
            const modal = document.getElementById('confirmModal');
            const modalTitle = document.getElementById('modal-title');
            const modalBody = document.getElementById('modal-body');
            const modalFooter = document.getElementById('modal-footer');
            
            // Define o conteúdo do modal
            modalTitle.textContent = title;
            modalBody.innerHTML = content;
            
            // Limpa e adiciona os botões
            modalFooter.innerHTML = '';
            buttons.forEach(btn => {
                const button = document.createElement('button');
                button.className = btn.class || 'btn btn-secondary';
                button.textContent = btn.text;
                button.onclick = btn.action;
                modalFooter.appendChild(button);
            });
            
            // Exibe o modal
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
        }

        // ===== VALIDAÇÕES =====
        
        /**
         * Valida um CPF brasileiro
         * @param {string} cpf - CPF a ser validado
         * @returns {boolean} - True se válido, false caso contrário
         */
        function validateCPF(cpf) {
            cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
            
            if (cpf.length !== 11) return false;
            
            // Verifica se todos os dígitos são iguais
            if (/^(\d)\1{10}$/.test(cpf)) return false;
            
            // Valida primeiro dígito verificador
            let sum = 0;
            for (let i = 0; i < 9; i++) {
                sum += parseInt(cpf[i]) * (10 - i);
            }
            let digit1 = 11 - (sum % 11);
            if (digit1 > 9) digit1 = 0;
            
            // Valida segundo dígito verificador
            sum = 0;
            for (let i = 0; i < 10; i++) {
                sum += parseInt(cpf[i]) * (11 - i);
            }
            let digit2 = 11 - (sum % 11);
            if (digit2 > 9) digit2 = 0;
            
            return parseInt(cpf[9]) === digit1 && parseInt(cpf[10]) === digit2;
        }

        /**
         * Valida CEP usando API ViaCEP
         * @param {string} cep - CEP a ser validado
         * @returns {Promise<boolean>} - Promise que resolve com true se válido
         */
        async function validateCEP(cep) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep.replace(/[^\d]/g, '')}/json/`);
                const data = await response.json();
                
                if (!data.erro) {
                    // Preenche automaticamente o endereço
                    document.getElementById('reg-address').value = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`;
                    return true;
                }
            } catch (error) {
                console.log('Validação de CEP falhou, entrada manual permitida');
            }
            return false;
        }

        // ===== FORMATAÇÃO DE CAMPOS =====
        
        /**
         * Formata CPF com pontos e hífen
         */
        function formatCPF(value) {
            return value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }

        /**
         * Formata CEP com hífen
         */
        function formatCEP(value) {
            return value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
        }

        /**
         * Formata telefone no padrão brasileiro
         */
        function formatPhone(value) {
            return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})(\d{8})/, '(+55)$1-$2$3');
        }

        // ===== GERENCIAMENTO DE TELAS =====
        
        /**
         * Exibe uma tela específica e oculta as outras
         * @param {string} screenId - ID da tela a ser exibida
         */
        function showScreen(screenId) {
            // Lista de todas as telas do sistema
            const screens = [
                'login-screen', 'register-screen', 'twofa-screen', 'dashboard-screen',
                'user-management-screen', 'change-password-screen', 'logs-screen',
                'db-model-screen', 'error-screen'
            ];
            
            // Oculta todas as telas
            screens.forEach(screen => {
                document.getElementById(screen).classList.add('d-none');
            });
            
            // Exibe a tela selecionada
            const targetScreen = document.getElementById(screenId);
            targetScreen.classList.remove('d-none');
            targetScreen.classList.add('fade-in');
            
            // Atualiza a tela atual
            currentScreen = screenId.replace('-screen', '');
            
            // Gerencia a exibição do header
            const header = document.getElementById('header');
            const publicScreens = ['login', 'register', 'twofa', 'error'];
            
            if (currentUser && !publicScreens.includes(currentScreen)) {
                header.classList.remove('d-none');
                updateNavigation();
            } else {
                header.classList.add('d-none');
            }
        }

        /**
         * Atualiza a navegação baseada no usuário logado
         */
        function updateNavigation() {
            const nav = document.getElementById('main-nav');
            const userInfo = document.getElementById('user-info');
            
            if (currentUser) {
                // Exibe informações do usuário
                userInfo.textContent = `${currentUser.name} (${currentUser.role === 'master' ? 'Master' : 'Comum'})`;
                
                // Define itens de navegação baseados no papel do usuário
                let navItems = [
                    { id: 'dashboard', text: 'Início', icon: 'fa-home' },
                    { id: 'db-model', text: 'Modelo BD', icon: 'fa-database' }
                ];
                
                // Adiciona itens específicos para usuário master
                if (currentUser.role === 'master') {
                    navItems.push(
                        { id: 'user-management', text: 'Usuários', icon: 'fa-users' },
                        { id: 'logs', text: 'Logs', icon: 'fa-list' }
                    );
                } else {
                    // Adiciona item específico para usuário comum
                    navItems.push({ id: 'change-password', text: 'Alterar Senha', icon: 'fa-key' });
                }
                
                // Gera HTML da navegação
                nav.innerHTML = navItems.map(item => 
                    `<button onclick="showScreen('${item.id}-screen')" class="btn btn-link nav-link me-3">
                        <i class="fas ${item.icon} me-2"></i>${item.text}
                    </button>`
                ).join('');
                
                nav.classList.remove('d-none');
            }
        }

        // ===== FUNÇÕES DE NAVEGAÇÃO =====
        
        function showLogin() {
            showScreen('login-screen');
            currentUser = null;
        }

        function showRegister() {
            showScreen('register-screen');
        }

        function showError(message) {
            document.getElementById('error-message').textContent = message;
            showScreen('error-screen');
        }

        // ===== MANIPULADORES DE FORMULÁRIOS =====
        
        /**
         * Limpa o formulário de login
         */
        function clearLoginForm() {
            document.getElementById('login-form').reset();
        }

        /**
         * Limpa o formulário de cadastro
         */
        function clearRegisterForm() {
            document.getElementById('register-form').reset();
        }

        /**
         * Manipula o envio do formulário de login
         */
        function handleLogin(event) {
            event.preventDefault();
            
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            if (!username || !password) {
                showToast('Preencha todos os campos', 'error');
                return;
            }
            
            // Busca o usuário no "banco de dados"
            const user = users.find(u => u.login === username && u.password === btoa(password));
            
            if (user) {
                currentUser = user;
                initiate2FA();
            } else {
                showToast('Login ou senha incorretos', 'error');
            }
        }

        /**
         * Manipula o envio do formulário de cadastro
         */
        function handleRegister(event) {
            event.preventDefault();
            
            // Coleta dados do formulário
            const formData = {
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
            
            // Validações
            if (formData.name.length < 15 || formData.name.length > 80) {
                showToast('Nome deve ter entre 15 e 80 caracteres', 'error');
                return;
            }
            
            if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.name)) {
                showToast('Nome deve conter apenas caracteres alfabéticos', 'error');
                return;
            }
            
            if (!validateCPF(formData.cpf)) {
                showToast('CPF inválido', 'error');
                return;
            }
            
            if (formData.login.length !== 6 || !/^[a-zA-Z]+$/.test(formData.login)) {
                showToast('Login deve ter exatamente 6 caracteres alfabéticos', 'error');
                return;
            }
            
            if (formData.password.length !== 8 || !/^[a-zA-Z]+$/.test(formData.password)) {
                showToast('Senha deve ter exatamente 8 caracteres alfabéticos', 'error');
                return;
            }
            
            if (formData.password !== formData.confirmPassword) {
                showToast('Senhas não coincidem', 'error');
                return;
            }
            
            if (users.find(u => u.login === formData.login)) {
                showToast('Login já existe', 'error');
                return;
            }
            
            if (users.find(u => u.cpf === formData.cpf)) {
                showToast('CPF já cadastrado', 'error');
                return;
            }
            
            // Cria novo usuário
            const newUser = {
                id: users.length + 1,
                ...formData,
                password: btoa(formData.password),
                role: 'common'
            };
            delete newUser.confirmPassword;
            
            users.push(newUser);
            
            showToast('Usuário cadastrado com sucesso!', 'success');
            setTimeout(() => showLogin(), 2000);
        }

        /**
         * Manipula a alteração de senha
         */
        function handleChangePassword(event) {
            event.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-new-password').value;
            
            if (btoa(currentPassword) !== currentUser.password) {
                showToast('Senha atual incorreta', 'error');
                return;
            }
            
            if (newPassword.length !== 8 || !/^[a-zA-Z]+$/.test(newPassword)) {
                showToast('Nova senha deve ter exatamente 8 caracteres alfabéticos', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showToast('Senhas não coincidem', 'error');
                return;
            }
            
            // Atualiza a senha
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            users[userIndex].password = btoa(newPassword);
            currentUser.password = btoa(newPassword);
            
            showToast('Senha alterada com sucesso!', 'success');
            document.querySelector('#change-password-screen form').reset();
        }

        // ===== FUNÇÕES DE AUTENTICAÇÃO 2FA =====
        
        /**
         * Inicia o processo de autenticação 2FA
         */
        function initiate2FA() {
            twoFAAttempts = 3;
            
            // Define as perguntas de segurança possíveis
            const questions = [
                { question: 'Qual o nome da sua mãe?', answer: currentUser.mother_name },
                { question: 'Qual a data do seu nascimento? (AAAA-MM-DD)', answer: currentUser.birth_date },
                { question: 'Qual o CEP do seu endereço?', answer: currentUser.cep }
            ];
            
            // Seleciona uma pergunta aleatória
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            twoFAQuestion = randomQuestion.question;
            twoFAAnswer = randomQuestion.answer;
            
            // Atualiza a interface
            document.getElementById('twofa-question').textContent = twoFAQuestion;
            document.getElementById('attempts-left').textContent = twoFAAttempts;
            document.getElementById('twofa-answer').value = '';
            
            showScreen('twofa-screen');
        }

        /**
         * Verifica a resposta do 2FA
         */
        function verify2FA() {
            const answer = document.getElementById('twofa-answer').value.trim();
            
            if (!answer) {
                showToast('Digite uma resposta', 'error');
                return;
            }
            
            if (answer.toLowerCase() === twoFAAnswer.toLowerCase()) {
                // Registra o login bem-sucedido
                logs.unshift({
                    id: logs.length + 1,
                    user_id: currentUser.id,
                    user_name: currentUser.name,
                    user_cpf: currentUser.cpf,
                    login_time: new Date().toLocaleString('pt-BR'),
                    twofa_method: twoFAQuestion.includes('mãe') ? 'Nome da Mãe' : 
                                 twoFAQuestion.includes('nascimento') ? 'Data de Nascimento' : 'CEP'
                });
                
                showToast('Login realizado com sucesso!', 'success');
                showScreen('dashboard-screen');
            } else {
                twoFAAttempts--;
                document.getElementById('attempts-left').textContent = twoFAAttempts;
                
                if (twoFAAttempts === 0) {
                    showToast('3 tentativas sem sucesso! Favor realizar Login novamente.', 'error');
                    setTimeout(() => showLogin(), 2000);
                } else {
                    showToast(`Resposta incorreta. ${twoFAAttempts} tentativa(s) restante(s)`, 'error');
                }
            }
        }

        // ===== FUNÇÕES DE GERENCIAMENTO DE USUÁRIOS =====
        
        /**
         * Pesquisa usuários por nome
         */
        function searchUsers() {
            const searchTerm = document.getElementById('user-search').value.toLowerCase();
            const commonUsers = users.filter(u => u.role === 'common');
            
            let filteredUsers = commonUsers;
            if (searchTerm) {
                filteredUsers = commonUsers.filter(u => 
                    u.name.toLowerCase().includes(searchTerm)
                );
            }
            
            const usersList = document.getElementById('users-list');
            
            if (filteredUsers.length === 0) {
                usersList.innerHTML = '<div class="text-center py-5 text-muted">Nenhum usuário encontrado</div>';
                return;
            }
            
            // Gera HTML da lista de usuários
            usersList.innerHTML = filteredUsers.map(user => `
                <div class="user-item p-3 mb-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="mb-1">${user.name}</h5>
                            <p class="mb-1 text-muted">Login: ${user.login} | CPF: ${user.cpf}</p>
                            <p class="mb-0 text-muted">Email: ${user.email}</p>
                        </div>
                        <button onclick="deleteUser(${user.id})" class="btn btn-danger">
                            <i class="fas fa-trash me-2"></i>Excluir
                        </button>
                    </div>
                </div>
            `).join('');
        }

        /**
         * Exibe confirmação para excluir usuário
         */
        function deleteUser(userId) {
            const user = users.find(u => u.id === userId);
            
            showModal(
                'Confirmar Exclusão',
                `Tem certeza que deseja excluir o usuário "${user.name}"?`,
                [
                    {
                        text: 'Cancelar',
                        class: 'btn btn-secondary me-2',
                        action: () => bootstrap.Modal.getInstance(document.getElementById('confirmModal')).hide()
                    },
                    {
                        text: 'Excluir',
                        class: 'btn btn-danger',
                        action: () => confirmDeleteUser(userId)
                    }
                ]
            );
        }

        /**
         * Confirma e executa a exclusão do usuário
         */
        function confirmDeleteUser(userId) {
            const userIndex = users.findIndex(u => u.id === userId);
            users.splice(userIndex, 1);
            
            bootstrap.Modal.getInstance(document.getElementById('confirmModal')).hide();
            showToast('Usuário excluído com sucesso!', 'success');
            searchUsers();
        }

        // ===== FUNÇÕES DE LOGS =====
        
        /**
         * Filtra logs baseado nos critérios selecionados
         */
        function filterLogs() {
            const filterType = document.getElementById('log-filter').value;
            const searchTerm = document.getElementById('log-search').value.toLowerCase();
            
            let filteredLogs = [...logs];
            
            if (searchTerm && filterType !== 'all') {
                filteredLogs = logs.filter(log => {
                    if (filterType === 'name') {
                        return log.user_name.toLowerCase().includes(searchTerm);
                    } else if (filterType === 'cpf') {
                        return log.user_cpf.includes(searchTerm);
                    }
                    return true;
                });
            }
            
            const logsList = document.getElementById('logs-list');
            
            if (filteredLogs.length === 0) {
                logsList.innerHTML = '<div class="text-center py-5 text-muted">Nenhum log encontrado</div>';
                return;
            }
            
            // Gera HTML da lista de logs
            logsList.innerHTML = filteredLogs.map(log => `
                <div class="log-item p-3 mb-3">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h5 class="mb-1">${log.user_name}</h5>
                            <p class="mb-1 text-muted">CPF: ${log.user_cpf}</p>
                            <p class="mb-0 text-muted">Data/Hora: ${log.login_time}</p>
                        </div>
                        <div class="text-end">
                            <span class="badge bg-primary">
                                2FA: ${log.twofa_method}
                            </span>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        /**
         * Realiza logout do usuário
         */
        function logout() {
            currentUser = null;
            showLogin();
            showToast('Logout realizado com sucesso!', 'success');
        }

        // ===== INICIALIZAÇÃO =====
        
        /**
         * Configura formatação automática dos campos
         */
        function setupInputFormatting() {
            // Formatação do CPF
            const cpfInput = document.getElementById('reg-cpf');
            if (cpfInput) {
                cpfInput.addEventListener('input', function(e) {
                    e.target.value = formatCPF(e.target.value);
                });
            }
            
            // Formatação e validação do CEP
            const cepInput = document.getElementById('reg-cep');
            if (cepInput) {
                cepInput.addEventListener('input', function(e) {
                    e.target.value = formatCEP(e.target.value);
                });
                
                cepInput.addEventListener('blur', function(e) {
                    if (e.target.value.length === 9) {
                        validateCEP(e.target.value);
                    }
                });
            }
            
            // Formatação do telefone
            const phoneInput = document.getElementById('reg-phone');
            if (phoneInput) {
                phoneInput.addEventListener('input', function(e) {
                    e.target.value = formatPhone(e.target.value);
                });
            }
        }

        /**
         * Inicializa a aplicação quando o DOM estiver carregado
         */
        document.addEventListener('DOMContentLoaded', function() {
            // Carrega preferências do usuário
            loadPreferences();
            
            // Configura formatação de campos
            setupInputFormatting();
            
            // Inicializa displays
            filterLogs();
            searchUsers();
            
            // Exibe tela de login
            showLogin();
        });