async function renderGraph() {
    try {
        const response = await fetch('commits.json');
        if (!response.ok) throw new Error('Data nenalezena');
        const commitData = await response.json();

        const graphContainer = document.getElementById('contribution-graph');
        
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 364); 

        for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
            
            const dateString = d.toISOString().split('T')[0];
            const commits = commitData[dateString] || 0;

            const square = document.createElement('div');
            square.classList.add('day-square');
            square.title = `${commits} commit(s) on ${dateString}`; 

            if (commits === 1) {
                square.style.backgroundColor = '#005f7a'; 
            } else if (commits === 2) {
                square.style.backgroundColor = '#008fb3'; 
            } else if (commits === 3) {
                square.style.backgroundColor = '#00a3cc'; 
            } else if (commits === 4) {
                square.style.backgroundColor = 'var(--electric-blue)'; 
                square.style.boxShadow = 'var(--glow)'; 
            } else if (commits >= 5) {
                square.style.backgroundColor = '#66e4ff'; 
                square.style.boxShadow = 'var(--glow)'; 
            }

            graphContainer.appendChild(square);
        }
    } catch (error) {
        console.error("Graf commitů se nepodařilo načíst:", error);
    }
}

renderGraph();