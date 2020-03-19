//Aqui eu busco no HTML e guardo nas variáveis todos os Buttons com os atributos definidos
const numberButtons = document.querySelectorAll('[data-number]');                           //Procura no documento os botões com atributo 'data-number'
const operationButtons = document.querySelectorAll('[data-operation]');                     //Procura no documento os botões com atributo 'data-operation'
const equalsButton = document.querySelector('[data-equals]');                               //Procura no documento os botões com atributo 'data-equals'
const deleteButton = document.querySelector('[data-delete]');                               //Procura no documento os botões com atributo 'data-delete'
const allClearButton = document.querySelector('[data-all-clear]');                          //Procura no documento os botões com atributo 'data-all-clear'
const previousOperandTextElement = document.querySelector('[data-previous-operand]');       //Procura no documento o botão com atributo 'data-previous-operand'
const currentOperandTextElement = document.querySelector('[data-current-operand]');         //Procura no documento o botão com atributo 'data-current-operand'

let currentOperand;                                                                         //Essa variável guarda na memória o atual valor do visor principal
let previousOperand;                                                                        //Essa variável guarda o valor (apenas o número) que está no visor superior

//Adiciona um EventListener de click para cada botão na variável 'numberButtons'
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        
        //Se o valor no visor superior for vazio, se houver alguma coisa no valor principal
        //e se a variável 'readyToReset' estiver marcada como true (ou seja, acabou de fazer um cálculo e pode ser zerada),
        //então eu apago o valor do visor principal e marco a variável para não zerar.
        if(calculator.previousOperand === "" && calculator.currentOperand !== "" && calculator.readyToReset) 
        {
            calculator.currentOperand = "";
            calculator.readyToReset = false;
        }

        calculator.appendNumber(button.innerText);                  //Chama a função 'appendNumber' e passa pra ela como parâmetro o número que está no botão
        calculator.updateDisplay();                                 //Chama a função 'updateDisplay'
    })
})

//Adiciona um EventListener de click para cada botão na variável 'operationButtons'
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);               //Chama a função 'chooseOperation' e passa pra ela como parâmetro o símbolo que está no botão
        calculator.updateDisplay();                                 //Chama a função 'updateDisplay'
    })
})

//Adiciona um eventListener de click no botão de igual
equalsButton.addEventListener('click', button => {
    calculator.compute();                                           //Chama a função 'compute' que faz o cálculo dos valores nos visores
    calculator.updateDisplay();                                     //Chama a função 'updateDisplay'
})

//Adiciona um eventListener de click no botão de Limpar
allClearButton.addEventListener('click', button => {
    calculator.clear();                                             //Chama a função 'clear' que apaga tudo nos visores
    calculator.updateDisplay();                                     //Chama a função 'updateDisplay'
})

//Adiciona um eventListener de click no botão de apagar
deleteButton.addEventListener('click', button => {
    calculator.delete();                                            //Chama a função 'delete' que apaga o último valor do visor principal
    calculator.updateDisplay();                                     //Chama a função 'updateDisplay'
})

class Calculator
{
    constructor(previousOperandTextElement, currentOperandTextElement)
    {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.readyToReset = false;
        this.clear();
    }

    //Apaga tudo
    clear()
    {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    //Apaga o último valor do visor principal
    delete()
    {
        //Corta a string do visor principal do primeiro caractere até o penultimo caractere, e sobrescreve ela no visor principal
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    //Função que recebe um número e adiciona ele no final do visor principal
    appendNumber(number)
    {
        //Verifica se o número que recebeu é um ponto. Se for E já houver um ponto no visor principal, então finaliza a função
        if (number === ',' && this.currentOperand.includes(',')) return;

        //Pega o visor principal, transforma em String e adiciona no final o número recebido pela função
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    //Esse método recebe um símbolo como parâmetro
    chooseOperation(operation)
    {
        //Se o valor do visor principal ainda estiver vazio, cancela a função
        if (this.currentOperand === '') return;

        //Se o valor do visor superior não estiver vazio, chama a função 'compute'
        //Ou seja, se eu ja tenho um valor em cim a e em baixo, e ao invés de eu
        //clicar em "=", eu clico em um sinal de operação, ele faz a conta e ja adiciona o sinal de novo
        if (this.previousOperand !== '')                        
        {
            this.compute();
        }

        this.operation = operation;                             //Inicializo a variável 'operand', que vai ser usada depois no 'updateDisplay' para adicionar o símbolo no visor
        this.previousOperand = this.currentOperand;             //Passa o valor do visor principal para o visor superior
        this.currentOperand = '';                               //Apaga o valor do visor principal
    }

    //Essa função faz o cálculo matemático
    compute()
    {
        let computation;                                        //Essa variável vai guardar o resultado do cálculo matemático
        const prev = parseFloat(this.previousOperand);          //Converte o visor superior em tipo Number
        const current = parseFloat(this.currentOperand);        //Converte o visor principal em tipo Number

        //Evita erro encerrando a função caso um dos valores a serem calculados não for um número
        //Também é útil para evitar de se fazer o cálculo caso haja valores em apenas um dos visores
        if(isNaN(prev) || isNaN(current)) return;               

        //Faz o cálculo dependendo do símbolo que estiver em 'operation'
        switch (this.operation)
        {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }

        this.readyToReset = true;                               //Marca a variável como true
        this.currentOperand = computation;                      //Seta o visor principal como o resultado da conta
        this.operation = undefined;                             //Reseta a variável operation
        this.previousOperand = '';                              //Apaga o valor do visor superior
    }

    //Retorna o número formatado (com virgulas separando os conjuntos de 3) prontinho para ser exibido no visor
    getDisplayNumber(number)
    {
        const stringNumber = number.toString();                                                     //Primeiro, transforma o número recebido em uma string e guarda ele
        const integerDigits = parseFloat(stringNumber.split(',')[0]);                               //Pega o n° em string, divide ele em 2 bem onde estiver o ponto, pega a primeira parte dele e transforma em Number e salva na variável
        const decimalDigits = stringNumber.split(',')[1];                                           //Pega o n° em string, divide ele em 2 bem onde estiver o ponto, pega segunda parte dele e salva na variável
        let integerDisplay;                                                                         //Cria a variável que vai guardar o número inteiro (antes do ponto)

        //Se não for um número, apaga o valor dele
        if(isNaN(integerDigits))
        {
            integerDisplay = '';
        }
        //Se for um número, localiza ele com base no padrão inglês (sem fração)
        else
        {
            integerDisplay = integerDigits.toLocaleString('br', {maximumFractionDigits : 0})
        }

        //Se a variável 'decimalDigits' não estiver nula...
        if(decimalDigits != null)
        {
            //...junta a variável 'integerDisplay' com a 'decimalDigits' separadas por um ponto e retorna ela na função
            return `${integerDisplay},${decimalDigits}`;
        }
        //Senão, retorna só a variável do número inteiro, sem ponto
        else
        {
            return integerDisplay;
        }
    }

    //Faz a atualização visual dos campos de texto dos visores
    updateDisplay()
    {
        //Seta o campo de texto do visor principal como o resultado da função 'getDisplayNumber', para ela formatar ele bonitinho para ser exibido
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);

        //Se a operação não for nula, ou seja, se haver um símbolo de conta na variável 'operation'...
        if(this.operation != null)
        {
            //...então seta o campo de texto do visor superior como o valor do visor principal mais o símbolo do operador
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        }
        //Apaga o texto do visor superior depois de feito um cálculo
        else
        {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

//Constrói a classe 'Calculator' e salva na variável 'calculator', passando como parâmetros os campos de texto do visor da calculadora
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);