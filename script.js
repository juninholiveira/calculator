class Calculator
{
    constructor(previousOperandTextElement, currentOperandTextElement)
    {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.readyToReset = false;
        this.clear();
    }

    clear()
    {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete()
    {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    //Função que recebe um número e adiciona ele no final do visor principal
    appendNumber(number)
    {
        //Verifica se o número que recebeu é um ponto. Se for E já houver um ponto no visor principal, então finaliza a função
        if (number === '.' && this.currentOperand.includes('.')) return;

        //Pega o visor principal, transforma em String e adiciona no final o número recebido pela função
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation)
    {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '')
        {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute()
    {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if(isNaN(prev) || isNaN(current)) return;

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

        this.readyToReset = true;
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number)
    {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if(isNaN(integerDigits))
        {
            integerDisplay = '';
        }
        else
        {
            integerDisplay = integerDigits.toLocaleString('en', {maximumFractionDigits : 0})
        }

        if(decimalDigits != null)
        {
            return `${integerDisplay}.${decimalDigits}`;
        }
        else
        {
            return integerDisplay;
        }
    }

    updateDisplay()
    {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if(this.operation != null)
        {
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        }
        else
        {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

//Aqui eu busco no HTML e guardo nas variáveis todos os Buttons com os atributos definidos
const numberButtons = document.querySelectorAll('[data-number]');                           //Procura no documento os botões com atributo 'data-number'
const operationButtons = document.querySelectorAll('[data-operation]');                     //Procura no documento os botões com atributo 'data-operation'
const equalsButton = document.querySelector('[data-equals]');                               //Procura no documento os botões com atributo 'data-equals'
const deleteButton = document.querySelector('[data-delete]');                               //Procura no documento os botões com atributo 'data-delete'
const allClearButton = document.querySelector('[data-all-clear]');                          //Procura no documento os botões com atributo 'data-all-clear'
const previousOperandTextElement = document.querySelector('[data-previous-operand]');       //Procura no documento o botão com atributo 'data-previous-operand'
const currentOperandTextElement = document.querySelector('[data-current-operand]');         //Procura no documento o botão com atributo 'data-current-operand'

//Constrói a classe 'Calculator' e salva na variável 'calculator', passando como parâmetros os campos de texto do visor da calculadora
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

//Adiciona um EventListener de click para cada botão na variável 'numberButtons'
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        
        if(calculator.previousOperand === "" && calculator.currentOperand !== "" && calculator.readyToReset) 
        {
            calculator.currentOperand = "";
            calculator.readyToReset = false;
        }
        calculator.appendNumber(button.innerText);                  //Chama a função 'appendNumber' e passa pra ela como parâmetro o número que está no botão
        calculator.updateDisplay();                                 //Chama a função 'updateDisplay'
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    })
})

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
})

allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
})

deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
})