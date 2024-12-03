document.addEventListener('DOMContentLoaded', function () {
    const cookieName = 'wordCountResult';  
    const formSection = document.querySelector('#formOval');  

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let c = cookies[i].trim();
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    }

    function countWordsInBlock(block) {
        const text = block ? block.innerText.trim() : '';
        const words = text.split(/\s+/);
        return words.length;
    }

    const existingCookie = getCookie(cookieName);

    if (existingCookie) {
        const userChoice = confirm(`Результат підрахунку слів: ${existingCookie}. Бажаєте видалити ці дані?`);
        if (userChoice) {
            eraseCookie(cookieName);
            location.reload();  
        } else {
            alert('Дані з cookies збережені. Для нового підрахунку перезавантажте сторінку.');
            formSection.style.display = 'none';  
        }
    } else {
        const wordCount = countWordsInBlock(formSection);
        alert(`Кількість слів у тексті: ${wordCount}`);
        setCookie(cookieName, wordCount, 7);  
    }
});
