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
    
        const existingForm = selectedBlock.querySelector('.edit-form');
        if (existingForm) existingForm.remove();
    
        const editForm = document.createElement('div');
        editForm.classList.add('edit-form');
        editForm.innerHTML = `
            <textarea id="editContent" rows="5" style="width: 100%;">${selectedBlock.textContent}</textarea>
            <button id="saveContent">Зберегти</button>
            <button id="resetContent">Скинути</button>
        `;
        editForm.style.border = '1px solid #ccc';
        editForm.style.marginTop = '10px';
        editForm.style.padding = '10px';
    
        selectedBlock.appendChild(editForm);
    
        editForm.querySelector('#saveContent').addEventListener('click', () => {
            const newContent = editForm.querySelector('#editContent').value;
            selectedBlock.textContent = newContent;
            localStorage.setItem(`${storagePrefix}${blockId}`, newContent);
        });
    
        editForm.querySelector('#resetContent').addEventListener('click', () => {
            const original = originalContent[blockId];
            selectedBlock.textContent = original;
            localStorage.removeItem(`${storagePrefix}${blockId}`);
        });
    });
});    