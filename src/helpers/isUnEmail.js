module.exports = (email)=>{
    const universityDomain = 'alex.edu.eg';
    const emailDomain      = email.split('@')[1];
    return universityDomain.includes(emailDomain);
};