document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    app.innerHTML = `
        <h2>Hello, World!</h2>
        <p>This is your first one-page application.</p>
        <button id="changeText">Click Me!</button>
    `;

    document.getElementById('changeText').addEventListener('click', () => {
        app.querySelector('p').textContent = 'You clicked the button! JS is working.';
    });
});
