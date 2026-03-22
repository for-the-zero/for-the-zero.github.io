const pathname = window.location.pathname;

document.querySelector('.l1').addEventListener('click', () => {
    window.location.href = 'https://ftz.is-a.dev' + pathname;
});
document.querySelector('.l2').addEventListener('click', () => {
    window.location.href = 'https://forthezero.vercel.app' + pathname;
});
document.querySelector('.l3').addEventListener('click', () => {
    window.location.href = 'https://forthezero.netlify.app' + pathname;
});
document.querySelector('.l4').addEventListener('click', () => {
    window.location.href = 'https://ftz.cc.cd' + pathname;
});
document.querySelector('.l5').addEventListener('click', () => {
    window.location.href = 'https://ftz.pages.dev' + pathname;
});