document.addEventListener('DOMContentLoaded', () => {
    const blocks = {
        block3: document.getElementById('block3'),
        block4: document.getElementById('block4'),
        block5: document.getElementById('block5'),
    };

    const alignLeft = (blockId) => {
        const block = blocks[blockId];
        if (block) {
            block.style.textAlign = 'left';
            localStorage.setItem(blockId, 'left');
        }
    };

    Object.keys(blocks).forEach((blockId) => {  
        const savedAlignment = localStorage.getItem(blockId);
        if (savedAlignment === 'left') {
            blocks[blockId].style.textAlign = savedAlignment;
        }
    });
    
    Object.keys(blocks).forEach((blockId) => {
        const block = blocks[blockId];
        if (block) {
            block.addEventListener('dblclick', () => alignLeft(blockId));
        }
    });
});
