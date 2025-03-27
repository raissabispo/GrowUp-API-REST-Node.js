function calculaIdade(user) {
    return new Date().getFullYear() - user.anoNascimento;
}

calculaIdade({
    anoNascimento: 2006,
});
