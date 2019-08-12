module.exports.templateTags = [{
    name: 'randomDocumentNumber',
    displayName: 'Random Document Number',
    description: 'Generate a random document number',
    args: [
        {
            displayName: 'Document type',
            description: 'The type of document number',
            type: 'enum',
            defaultValue: 'CPF',
            options: [
                {
                    displayName: 'CPF',
                    value: 'CPF',
                    description: 'Generate a random CPF'
                },
                {
                    displayName: 'CNPJ',
                    value: 'CNPJ',
                    description: 'Generate a random CNPJ'
                }
            ]
        },
        {
            displayName: 'Format output',
            description: 'Defines if the output should be formatted',
            type: 'boolean',
            defaultValue: false
        }
    ],
    async run(context, docType, formatted) {
        var doc = "";
        switch (docType) {
            case 'CPF':
                doc = generateCPF(formatted);
                break;
            case 'CNPJ':
                doc = generateCNPJ(formatted);
                break;
            default:
                throw 'Invalid document type';
        }
        return doc;
    }
}]

function generateCPF(shouldFormat) {
    var cpf = "";
    for (i=0; i<9; i++) {
        cpf += Math.floor(Math.random() * 9);
    }

    cpf += generateCPFDV(cpf);
    cpf += generateCPFDV(cpf);
    
    if (!validateCPF(cpf)) return generateCPF(shouldFormat);

    if (shouldFormat) cpf = `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
    
    return cpf;
}

function generateCPFDV(digits) {
    var total = 0;

    for (i=0; i<digits.length; i++) {
        total += parseInt(digits[i]) * (digits.length+1-i);
    }

    total = total % 11;
    if (total < 2) return 0;

    return 11 - total;
}

function validateCPF(digits) {
    blackList = [
        "00000000000",
        "11111111111",
        "22222222222",
        "33333333333",
        "44444444444",
        "55555555555",
        "66666666666",
        "77777777777",
        "88888888888",
        "99999999999",
        "12345678909"
    ];

    if (digits.length > 11) return false;
    if (digits in blackList) return false;

    return true;
}

function generateCNPJ(shouldFormat) {
    var cnpj = "";
    for (i=0; i<8; i++) {
        cnpj += Math.floor(Math.random() * 9);
    }

    cnpj += "0001";
    cnpj += generateCNPJDV(cnpj);
    cnpj += generateCNPJDV(cnpj);

    if (!validateCNPJ(cnpj)) return generateCNPJ(shouldFormat);

    if (shouldFormat) cnpj = `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;

    return cnpj;
}

function generateCNPJDV(digits) {
    var total = 0;

    for (i=digits.length-1; i>=0; i--) {
        var p = (i%8) + 2;
        var n = parseInt(digits[digits.length-i-1]);
        total += n * p;
    }

    total = total % 11;
    if (total < 2) return 0;

    return 11 - total;
}

function validateCNPJ(digits) {
    blackList = [
        "00000000000000",
        "11111111111111",
        "22222222222222",
        "33333333333333",
        "44444444444444",
        "55555555555555",
        "66666666666666",
        "77777777777777",
        "88888888888888",
        "99999999999999",
        "12345678901234"
    ];

    if (digits.length > 14) return false;
    if (digits in blackList) return false;

    return true;
}