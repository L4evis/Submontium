async function renderGraph() {
    try {
        const response = await fetch('commits.json');
        if (!response.ok) throw new Error('Data nenalezena');
        const commitData = await response.json();

        const graphContainer = document.getElementById('contribution-graph');
        const monthsContainer = document.getElementById('months-labels');
        
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 364); 

        let lastMonth = -1;
        let lastYear = -1; // Přidáno sledování roku
        let weekIndex = 0; 
        let dayCounter = 0; 

        for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
            
            // --- Logika pro měsíce a roky ---
            if (dayCounter % 7 === 0) {
                const currentMonth = d.getMonth();
                const currentYear = d.getFullYear(); // Zjištění aktuálního roku
                
                if (currentMonth !== lastMonth) {
                    const monthLabel = document.createElement('div');
                    monthLabel.classList.add('month-label');
                    
                    // Zobrazíme rok, pokud je to první štítek, nebo pokud se rok právě změnil (Leden)
                    if (lastYear === -1 || currentYear !== lastYear) {
                        monthLabel.innerHTML = `${monthNames[currentMonth]}<span class="year-label">${currentYear}</span>`;
   			 
                        // Zvýraznění roku rezavou barvou z tvého tématu
                        monthLabel.style.color = 'var(--brass)'; 
                        monthLabel.style.fontWeight = 'bold';
                    } else {
                        monthLabel.textContent = monthNames[currentMonth];
                    }
                    
                    monthLabel.style.left = `${weekIndex * 16}px`;
                    monthsContainer.appendChild(monthLabel);
                    
                    lastMonth = currentMonth;
                    lastYear = currentYear; // Uložení roku pro další kontrolu
                }
                weekIndex++; 
            }
            
            // --- Logika pro dny (čtverečky) ---
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
            dayCounter++;
        }
    } catch (error) {
        console.error("Graf commitů se nepodařilo načíst:", error);
    }
}

renderGraph();