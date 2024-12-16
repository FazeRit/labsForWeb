document.addEventListener("DOMContentLoaded", () => {
    const playBtn = document.getElementById("playBtn");
    const contentTop = document.getElementById("contentTop");
    const initialContent = contentTop.innerHTML;
    const EVENT_STORAGE_KEY = "animationEvents";    

    function clearLocalStorage() {
        localStorage.removeItem(EVENT_STORAGE_KEY);
    }

    playBtn.addEventListener("click", () => {
        fetch('https://lab7-back.vercel.app/api/clear', { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    console.log('Events cleared on server');
                    clearLocalStorage();
                } else {
                    console.error('Failed to clear events on server');
                }
            })
            .catch(error => {
                console.error('Error clearing events on server:', error);
            });
    
        contentTop.innerHTML = `
            <div class="work" id="work">
                <div class="controls">
                    <p id="message"></p>
                    <button id="closeBtn">Close</button>
                    <button id="startBtn">Start</button>
                </div>
                <div id="anim" class="anim">
                    <div class="square red"></div>
                    <div class="square green"></div>
                </div>
            </div>
        `;
        initializeWork();
    });    

    function initializeWork() {
        const closeBtn = document.getElementById("closeBtn");
        const startBtn = document.getElementById("startBtn");
        const anim = document.getElementById("anim");
        const squares = document.querySelectorAll(".square");

        let animationFrame;
        let positions = [];
        let directions = [];
        let steps = [10, 10];
        const MAX_STEP = 50;

        squares.forEach((square, index) => {
            positions.push({
                x: Math.random() * (anim.clientWidth - 10),
                y: Math.random() * (anim.clientHeight - 10),
            });
            directions.push({
                dx: Math.random() > 0.5 ? 1 : -1,
                dy: Math.random() > 0.5 ? 1 : -1,
            });

            square.style.transform = `translate(${positions[index].x}px, ${positions[index].y}px)`;
        });

        closeBtn.addEventListener("click", () => {
            displayEvents();
            contentTop.innerHTML = initialContent;
        });

        startBtn.addEventListener("click", () => {
            startBtn.classList.add("hidden");
            createReloadButton();
            resetSquares();
            logEvent("Анімація почалась.");
            animationFrame = requestAnimationFrame(moveSquares);
        });

        function moveSquares() {
            let collisionDetected = false;

            squares.forEach((square, index) => {
                const pos = positions[index];
                const dir = directions[index];
                let step = steps[index];

                if (pos.x + dir.dx * step < 0) {
                    const remaining = Math.abs(pos.x / dir.dx);
                    pos.x = remaining;
                    dir.dx *= -1;
                    logEvent(`Квадрат ${square.classList[1]} доторкнувся до лівої стінки.`);
                } else if (pos.x + dir.dx * step > anim.clientWidth - 10) {
                    const remaining = Math.abs((anim.clientWidth - 10 - pos.x) / dir.dx);
                    pos.x = anim.clientWidth - 10 - remaining;
                    dir.dx *= -1;
                    logEvent(`Квадрат ${square.classList[1]} доторкнувся до правої стінки.`);
                } else {
                    pos.x += dir.dx * step;
                }

                if (pos.y + dir.dy * step < 0) {
                    const remaining = Math.abs(pos.y / dir.dy);
                    pos.y = remaining;
                    dir.dy *= -1;
                    logEvent(`Квадрат ${square.classList[1]} доторкнувся до верхньої стінки.`);
                } else if (pos.y + dir.dy * step > anim.clientHeight - 10) {
                    const remaining = Math.abs((anim.clientHeight - 10 - pos.y) / dir.dy);
                    pos.y = anim.clientHeight - 10 - remaining;
                    dir.dy *= -1;
                    logEvent(`Квадрат ${square.classList[1]} доторкнувся до нижньої стінки.`);
                } else {
                    pos.y += dir.dy * step;
                }

                steps[index] = Math.min(steps[index] + 1, MAX_STEP);
                square.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
            });

            if (checkCollision(squares[0], squares[1])) {
                logEvent("Зіткнення між квадратами!");
                setTimeout(() => {
                    alert("Анімація завершена! Зіткнення!");
                }, 0);
                cancelAnimationFrame(animationFrame);
                collisionDetected = true;
            }

            if (!collisionDetected) {
                animationFrame = requestAnimationFrame(moveSquares);
            }
        }

        function createReloadButton() {
            const controls = document.querySelector(".controls");
            const reloadBtn = document.createElement("button");
            reloadBtn.textContent = "Reload";
            reloadBtn.id = "reloadBtn";
            reloadBtn.addEventListener("click", () => {
                resetSquares();
                reloadBtn.remove();
                startBtn.classList.remove("hidden");
                logEvent("Анімація перезавантажена.");
            });
            controls.appendChild(reloadBtn);
        }

        function resetSquares() {
            squares.forEach((_, index) => {
                positions[index] = {
                    x: Math.random() * (anim.clientWidth - 10),
                    y: Math.random() * (anim.clientHeight - 10),
                };
                directions[index] = {
                    dx: Math.random() > 0.5 ? 1 : -1,
                    dy: Math.random() > 0.5 ? 1 : -1,
                };
                steps[index] = 10;
                squares[index].style.transform = `translate(${positions[index].x}px, ${positions[index].y}px)`;
            });
            logEvent("Позиції квадратів перезавантажено.");
        }

        function checkCollision(el1, el2) {
            const r1 = el1.getBoundingClientRect();
            const r2 = el2.getBoundingClientRect();
            return !(
                r1.right < r2.left ||
                r1.left > r2.right ||
                r1.bottom < r2.top ||
                r1.top > r2.bottom
            );
        }

        function logEvent(text) {
            const events = JSON.parse(localStorage.getItem(EVENT_STORAGE_KEY)) || [];
            const event = {
                id: events.length + 1,
                time: new Date().toLocaleTimeString(),
                message: text,
            };
            events.push(event);
            localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(events));

            fetch('https://lab7-back.vercel.app/api/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventTime: new Date(),
                    eventType: 'AnimationEvent',
                    message: text,
                }),
            }).catch(error => console.error('Error saving event to server:', error));

            displayEvents();
        }

        function displayEvents() {
            const events = JSON.parse(localStorage.getItem(EVENT_STORAGE_KEY)) || [];

            fetch('https://lab7-back.vercel.app/api/')
                .then(response => response.json())
                .then(serverEvents => {
                    const block5 = document.getElementById("block5");
                    block5.innerHTML = `
                        <h3>Event Log</h3>
                        <table>
                            <tr>
                                <th>№</th>
                                <th>Час</th>
                                <th>Подія (LocalStorage)</th>
                                <th>Подія (Database)</th>
                            </tr>
                            ${events.map((event, index) => `
                                <tr>
                                    <td>${event.id}</td>
                                    <td>${event.time}</td>
                                    <td>${event.message}</td>
                                    <td>${serverEvents[index] ? serverEvents[index].message : ''}</td>
                                </tr>
                            `).join('')}
                        </table>
                    `;
                })
                .catch(error => console.error('Error fetching events from server:', error));
        }
    }
});
