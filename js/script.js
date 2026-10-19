// État de la calculatrice
        const calculatorState = {
            currentOperand: '0',
            previousOperand: '',
            operation: undefined,
            memory: 0,
            history: []
        };

        // Sélection des éléments d'affichage
        const currentOperationDisplay = document.getElementById('current-operation');
        const previousOperationDisplay = document.getElementById('previous-operation');
        const historyList = document.getElementById('history-list');

        // Mise à jour de l'affichage
        function updateDisplay() {
            currentOperationDisplay.textContent = calculatorState.currentOperand;
           
            if (calculatorState.operation != null) {
                previousOperationDisplay.textContent =
                    `${calculatorState.previousOperand} ${getOperationSymbol(calculatorState.operation)}`;
            } else {
                previousOperationDisplay.textContent = calculatorState.previousOperand;
            }
        }

        // Obtenir le symbole d'opération pour l'affichage
        function getOperationSymbol(operation) {
            const symbols = {
                '+': '+',
                '-': '−',
                '*': '×',
                '/': '÷',
                'power': '^',
                'sqrt': '√',
                'percent': '%'
            };
            return symbols[operation] || operation;
        }

        // Ajouter un chiffre
        function appendNumber(number) {
            if (calculatorState.currentOperand === '0' || calculatorState.currentOperand === 'Erreur') {
                calculatorState.currentOperand = number;
            } else {
                calculatorState.currentOperand += number;
            }
        }

        // Choisir une opération
        function chooseOperation(operation) {
            if (calculatorState.currentOperand === 'Erreur') return;
           
            if (calculatorState.currentOperand === '') {
                calculatorState.currentOperand = '0';
            }
           
            if (calculatorState.previousOperand !== '') {
                compute();
            }
           
            calculatorState.operation = operation;
            calculatorState.previousOperand = calculatorState.currentOperand;
            calculatorState.currentOperand = '';
        }

        // Calculer le résultat
        function compute() {
            let computation;
            const prev = parseFloat(calculatorState.previousOperand);
            const current = parseFloat(calculatorState.currentOperand);
           
            if (isNaN(prev) || isNaN(current)) return;
           
            try {
                switch (calculatorState.operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '*':
                        computation = prev * current;
                        break;
                    case '/':
                        if (current === 0) {
                            throw new Error("Division par zéro");
                        }
                        computation = prev / current;
                        break;
                    case 'power':
                        computation = Math.pow(prev, current);
                        break;
                    case 'percent':
                        computation = prev * (current / 100);
                        break;
                    default:
                        return;
                }
               
                // Formater le résultat (éviter les nombres comme 0.30000000000000004)
                computation = parseFloat(computation.toPrecision(12));
               
                // Ajouter au historique
                addToHistory(`${calculatorState.previousOperand} ${getOperationSymbol(calculatorState.operation)} ${calculatorState.currentOperand} = ${computation}`);
               
                calculatorState.currentOperand = computation.toString();
                calculatorState.operation = undefined;
                calculatorState.previousOperand = '';
            } catch (error) {
                calculatorState.currentOperand = 'Erreur';
                calculatorState.operation = undefined;
                calculatorState.previousOperand = '';
            }
        }

        // Fonctions scientifiques
        function scientificFunction(func) {
            const current = parseFloat(calculatorState.currentOperand);
           
            if (isNaN(current) || calculatorState.currentOperand === 'Erreur') return;
           
            try {
                let result;
                let operationText = '';
               
                switch (func) {
                    case 'sin':
                        result = Math.sin(current * Math.PI / 180); // Conversion degrés -> radians
                        operationText = `sin(${current})`;
                        break;
                    case 'cos':
                        result = Math.cos(current * Math.PI / 180);
                        operationText = `cos(${current})`;
                        break;
                    case 'tan':
                        if (Math.abs(current % 180) === 90) {
                            throw new Error("Tangente non définie");
                        }
                        result = Math.tan(current * Math.PI / 180);
                        operationText = `tan(${current})`;
                        break;
                    case 'sqrt':
                        if (current < 0) {
                            throw new Error("Racine carrée négative");
                        }
                        result = Math.sqrt(current);
                        operationText = `√(${current})`;
                        break;
                    case 'log':
                        if (current <= 0) {
                            throw new Error("Logarithme non défini");
                        }
                        result = Math.log10(current);
                        operationText = `log(${current})`;
                        break;
                    case 'ln':
                        if (current <= 0) {
                            throw new Error("Logarithme naturel non défini");
                        }
                        result = Math.log(current);
                        operationText = `ln(${current})`;
                        break;
                    case 'factorial':
                        if (current < 0 || !Number.isInteger(current)) {
                            throw new Error("Factorielle non définie");
                        }
                        if (current > 100) {
                            throw new Error("Nombre trop grand");
                        }
                        result = factorial(current);
                        operationText = `(${current}!)`;
                        break;
                    case 'pi':
                        result = Math.PI;
                        operationText = 'π';
                        break;
                    case 'e':
                        result = Math.E;
                        operationText = 'e';
                        break;
                    case 'toggle-sign':
                        result = -current;
                        operationText = `-(${current})`;
                        break;
                    default:
                        return;
                }
               
                // Formater le résultat
                result = parseFloat(result.toPrecision(12));
               
                // Ajouter au historique si ce n'est pas une constante
                if (func !== 'pi' && func !== 'e') {
                    addToHistory(`${operationText} = ${result}`);
                }
               
                calculatorState.currentOperand = result.toString();
            } catch (error) {
                calculatorState.currentOperand = 'Erreur';
            }
        }

        // Calcul de factorielle
        function factorial(n) {
            if (n === 0 || n === 1) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }

        // Fonctions mémoire
        function memoryFunction(action) {
            const current = parseFloat(calculatorState.currentOperand);
           
            switch (action) {
                case 'mc': // Mémoire Clear
                    calculatorState.memory = 0;
                    break;
                case 'mr': // Mémoire Recall
                    if (calculatorState.currentOperand === 'Erreur') return;
                    calculatorState.currentOperand = calculatorState.memory.toString();
                    break;
                case 'm+': // Mémoire Add
                    if (!isNaN(current)) {
                        calculatorState.memory += current;
                    }
                    break;
                case 'm-': // Mémoire Subtract
                    if (!isNaN(current)) {
                        calculatorState.memory -= current;
                    }
                    break;
            }
            updateDisplay();
        }

        // Ajouter un point décimal
        function addDecimal() {
            if (calculatorState.currentOperand === 'Erreur') {
                calculatorState.currentOperand = '0.';
            } else if (!calculatorState.currentOperand.includes('.')) {
                calculatorState.currentOperand += '.';
            }
        }

        // Effacer le dernier caractère
        function backspace() {
            if (calculatorState.currentOperand === 'Erreur') {
                calculatorState.currentOperand = '0';
            } else if (calculatorState.currentOperand.length > 1) {
                calculatorState.currentOperand = calculatorState.currentOperand.slice(0, -1);
            } else {
                calculatorState.currentOperand = '0';
            }
        }

        // Effacer tout
        function clearAll() {
            calculatorState.currentOperand = '0';
            calculatorState.previousOperand = '';
            calculatorState.operation = undefined;
        }

        // Effacer l'entrée courante
        function clearEntry() {
            calculatorState.currentOperand = '0';
        }

        // Ajouter au historique
        function addToHistory(calculation) {
            calculatorState.history.unshift(calculation);
            if (calculatorState.history.length > 10) {
                calculatorState.history.pop();
            }
            updateHistoryDisplay();
        }

        // Mettre à jour l'affichage de l'historique
        function updateHistoryDisplay() {
            historyList.innerHTML = '';
            calculatorState.history.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.textContent = item;
                historyList.appendChild(historyItem);
            });
        }

        // Gestion des événements de clic
        document.querySelector('.buttons-container').addEventListener('click', event => {
            if (!event.target.matches('button')) return;
           
            const button = event.target;
           
            if (button.hasAttribute('data-number')) {
                appendNumber(button.getAttribute('data-number'));
                updateDisplay();
                return;
            }
           
            if (button.hasAttribute('data-action')) {
                const action = button.getAttribute('data-action');
               
                switch (action) {
                    case '+':
                    case '-':
                    case '*':
                    case '/':
                    case 'power':
                    case 'percent':
                        chooseOperation(action);
                        updateDisplay();
                        break;
                       
                    case 'equals':
                        compute();
                        updateDisplay();
                        break;
                       
                    case 'clear':
                        clearAll();
                        updateDisplay();
                        break;
                       
                    case 'decimal':
                        addDecimal();
                        updateDisplay();
                        break;
                       
                    case 'backspace':
                        backspace();
                        updateDisplay();
                        break;
                       
                    case 'mc':
                    case 'mr':
                    case 'm+':
                    case 'm-':
                        memoryFunction(action);
                        break;
                       
                    default:
                        // Fonctions scientifiques
                        scientificFunction(action);
                        updateDisplay();
                        break;
                }
            }
        });

        // Gestion du clavier
        document.addEventListener('keydown', event => {
            const key = event.key;
           
            if ((key >= '0' && key <= '9') || key === '.') {
                if (key === '.') {
                    addDecimal();
                } else {
                    appendNumber(key);
                }
                updateDisplay();
            } else if (key === '+' || key === '-' || key === '*' || key === '/') {
                chooseOperation(key === '*' ? '*' : key === '/' ? '/' : key);
                updateDisplay();
            } else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                compute();
                updateDisplay();
            } else if (key === 'Escape' || key === 'Delete') {
                clearAll();
                updateDisplay();
            } else if (key === 'Backspace') {
                backspace();
                updateDisplay();
            } else if (key === '%') {
                chooseOperation('percent');
                updateDisplay();
            }
        });

        // Initialiser l'affichage
        updateDisplay();