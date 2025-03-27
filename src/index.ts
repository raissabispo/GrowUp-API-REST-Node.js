interface User {
    anoNascimento: number;
}

function calculaIdade(user: User): number {
    return new Date().getFullYear() - user.anoNascimento;
}


calculaIdade({
    anoNascimento: 2006,
});