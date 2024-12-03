document.addEventListener('DOMContentLoaded', () => {
    const blockSelector = document.getElementById('blockSelector');
    const blocks = document.querySelectorAll('[id^="block"]'); 
    const originalContent = {};
    const storagePrefix = 'edited_block_'; 

    blocks.forEach(block => {
        originalContent[block.id] = block.innerHTML;
    });

    blockSelector.addEventListener('click', (event) => {
        const blockId = event.target.dataset.blockId;
        if (!blockId) return;

        const selectedBlock = document.getElementById(blockId);
        if (!selectedBlock) return;

        const editForm = document.createElement('div');
        editForm.innerHTML = `
            <textarea id="editContent" rows="5" style="width: 100%;">${selectedBlock.innerHTML}</textarea>
            <button id="saveContent">Зберегти</button>
            <button id="resetContent">Скинути</button>
        `;
        editForm.style.border = '1px solid #ccc';
        editForm.style.marginTop = '10px';
        editForm.style.padding = '10px';

        const existingForm = selectedBlock.querySelector('div');
        if (existingForm) existingForm.remove();

        selectedBlock.appendChild(editForm);

        document.getElementById('saveContent').addEventListener('click', () => {
            const newContent = document.getElementById('editContent').value;
            selectedBlock.innerHTML = newContent;
            localStorage.setItem(`${storagePrefix}${blockId}`, newContent);
        });

        document.getElementById('resetContent').addEventListener('click', () => {
            const original = originalContent[blockId];
            selectedBlock.innerHTML = original;
            selectedBlock.style.fontStyle = 'normal';
            localStorage.removeItem(`${storagePrefix}${blockId}`);
        });
    });

    blocks.forEach(block => {
        const savedContent = localStorage.getItem(`${storagePrefix}${block.id}`);
        if (savedContent) {
            block.innerHTML = savedContent;
            block.style.fontStyle = 'italic';
        }
    });
});
