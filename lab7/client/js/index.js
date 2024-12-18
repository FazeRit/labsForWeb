    document.addEventListener("DOMContentLoaded", () => {
        const playBtn = document.getElementById("playBtn");
        const contentTop = document.getElementById("contentTop");
        const initialContent = contentTop.innerHTML;
        const EVENT_STORAGE_KEY = "animationEvents";
        let eventLog = [];

        function clearLocalStorage() {
            localStorage.removeItem(EVENT_STORAGE_KEY);
        }

        function saveEventsToStorageAndServer() {
            const BATCH_SIZE = 50; 
            const totalEvents = eventLog.length;
        
            if (totalEvents > 0) {
                localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(eventLog));
                console.log("Збережено події локально:", eventLog);
        
                for (let i = 0; i < totalEvents; i += BATCH_SIZE) {
                    const batch = eventLog.slice(i, i + BATCH_SIZE);
        
                    fetch('https://lab7-back.vercel.app/api/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({events: batch}),
                    })
                    .then(response => {
                        if (response.ok) {
                            console.log(`Успішно відправлено пакет подій ${i + 1} - ${i + batch.length}`);
                        } else {
                            console.error("Помилка при відправці пакету:", response.statusText);
                        }
                    })
                    .catch(error => {
                        console.error('Помилка відправки подій на сервер:', error);
                    });
                }
            }
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
                .catch(error => console.error('Error clearing events on server:', error));

            eventLog = [];  
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
            let steps = [1, 1];
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
                saveEventsToStorageAndServer();
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

                    if (pos.x + dir.dx * step < 0 || pos.x + dir.dx * step > anim.clientWidth - 10) {
                        dir.dx *= -1;
                        logEvent(`Квадрат ${square.classList[1]} доторкнувся до вертикальної стінки.`);
                    }
                    if (pos.y + dir.dy * step < 0 || pos.y + dir.dy * step > anim.clientHeight - 10) {
                        dir.dy *= -1;
                        logEvent(`Квадрат ${square.classList[1]} доторкнувся до горизонтальної стінки.`);
                    }

                    pos.x += dir.dx * step;
                    pos.y += dir.dy * step;
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

            function logEvent(text, eventType = 'generic') {
                const event = {
                    id: eventLog.length + 1,
                    eventTime: new Date(),
                    eventType: eventType,                  
                    message: text                          
                };
                eventLog.push(event);
            }
            
        }

        function displayEvents() {
            const events = JSON.parse(localStorage.getItem(EVENT_STORAGE_KEY)) || [];

            setTimeout(() => {
                fetch('https://lab7-back.vercel.app/api/')
                    .then(response => response.json())
                    .then(serverEvents   => {
                        renderEventTable(events, serverEvents.data);
                    })
                    .catch(error => console.error('Error fetching events from server:', error));
            }, 5000); 
        }

        function renderEventTable(localEvents, serverEvents) {
            const block5 = document.getElementById("block5");
            
            // Zip the local and server events together
            const maxLength = Math.max(localEvents.length, serverEvents.length);
            const combinedEvents = [];
        
            for (let i = 0; i < maxLength; i++) {
                combinedEvents.push({
                    localEvent: localEvents[i] || null, // If localEvent is undefined, use null
                    serverEvent: serverEvents[i] || null // If serverEvent is undefined, use null
                });
            }
        
            block5.innerHTML = `
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-family: Arial, sans-serif;">
                    <thead style="background-color: #4CAF50; color: white;">
                        <tr>
                            <th style="padding: 10px; text-align: left;">№</th>
                            <th style="padding: 10px; text-align: left;">Час (LocalStorage)</th>
                            <th style="padding: 10px; text-align: left;">Подія (LocalStorage)</th>
                            <th style="padding: 10px; text-align: left;">Час (Database)</th>
                            <th style="padding: 10px; text-align: left;">Подія (Database)</th>
                        </tr>
                    </thead>
                    <tbody style="background-color: #f2f2f2;">
                        ${combinedEvents.map(({ localEvent, serverEvent }) => `
                            <tr style="border-bottom: 1px solid #ddd;">
                                <td style="padding: 8px;">${localEvent ? localEvent.id : ''}</td>
                                <td style="padding: 8px;">${localEvent ? new Date(localEvent.eventTime).toLocaleString() : ''}</td>
                                <td style="padding: 8px;">${localEvent ? localEvent.message : ''}</td>
                                <td style="padding: 8px;">${serverEvent ? new Date(serverEvent.eventTime).toLocaleString() : ''}</td>
                                <td style="padding: 8px;">${serverEvent ? serverEvent.message : ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }             
    });
