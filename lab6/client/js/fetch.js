document.addEventListener('DOMContentLoaded', () => {
    const contentElement = document.getElementById('dynamicContent');

    async function fetchData() {
        try {
            const response = await fetch('https://lab6-b.vercel.app/api/');
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const data = await response.json();

            console.log('Fetched data:', data);
            
            if (data.data) {
                renderText(data.data);  
            } else {
                clearContent(); 
            }
        } catch (error) {   
            console.error('Error fetching data:', error);
        }
    }

    function renderText({ id, text, padding, animationDuration, mainColor }) {
        console.log('Rendering text:', text);
    
        contentElement.innerHTML = '';
    
        const textElement = document.createElement('div');
        textElement.classList.add('text-item', 'glitch-container');
    
        textElement.style.padding = `${padding}px`;
    
        textElement.innerHTML = `
            <h1 
                class="glitch" 
                data-text="${text}" 
                style="color: ${mainColor}; font-size: 70px; animation-duration: ${animationDuration}s;"
            >
                ${text}
            </h1>
            <button data-id="${id}" class="delete-button">Delete</button>
        `;
    
        contentElement.appendChild(textElement);
    
        
        textElement.querySelector('.delete-button').addEventListener('click', async (event) => {
            const id = event.target.getAttribute('data-id');
            await deleteText(id);
        });
    }
    
    function clearContent() {
        console.log('No data available. Clearing content.');
        contentElement.innerHTML = `
            <div class="no-content">
                <div class="no-content__icon">🚫</div>
                <p class="no-content__message">No content available</p>
            </div>
        `;
    }    

    async function deleteText(id) {
        try {
            const response = await fetch(`https://lab6-b.vercel.app/api/delete/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Failed to delete text with ID ${id}: ${response.status}`);
            }
            fetchData();
        } catch (error) {
            console.error('Error deleting text:', error);
            alert('Failed to delete text. Please try again.');
        }
    }

    fetchData();
    setInterval(fetchData, 5000);
}); 
