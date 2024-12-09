document.addEventListener('DOMContentLoaded', () => {
    const styleForm = document.getElementById('styleForm');

    styleForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const text = document.getElementById('text').value.trim();
        const padding = document.getElementById('padding').value;
        const animationDuration = document.getElementById('animationDuration').value;
        const mainColor = document.getElementById('mainColor').value;

        if (!text) {
            alert('Text field is required.');
            return;
        }

        const formData = {
            text,
            padding: parseInt(padding, 10),
            animationDuration: parseFloat(animationDuration),
            mainColor,
        };

        try {
            const response = await fetch('https://lab6-b.vercel.app/api/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            alert('Parameters successfully sent!');
            styleForm.reset();
        } catch (error) {
            console.error('Error:', error);
            alert(`Failed to send parameters: ${error.message}`);
        }
    });
});
    