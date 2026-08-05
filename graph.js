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

        // OPRAVA: Zajištění, že mřížka začíná absolutně vždy v neděli
        const startDayOfWeek = startDate.getDay(); // 0 = Neděle
        startDate.setDate(startDate.getDate() - startDayOfWeek);

        let lastMonth = -1;
        let lastYear = -1;
        let weekIndex = 0; 
        let dayCounter = 0; 

        for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
            
            // --- Logika pro měsíce a roky ---
            if (dayCounter % 7 === 0) {
                const currentMonth = d.getMonth();
                const currentYear = d.getFullYear(); 
                
                if (currentMonth !== lastMonth) {
                    const monthLabel = document.createElement('div');
                    monthLabel.classList.add('month-label');
                    
                    if (lastYear === -1 || currentYear !== lastYear) {
                        monthLabel.innerHTML = `${monthNames[currentMonth]}<span class="year-label">${currentYear}</span>`;
                        monthLabel.style.color = 'var(--brass)'; 
                        monthLabel.style.fontWeight = 'bold';
                    } else {
                        monthLabel.textContent = monthNames[currentMonth];
                    }
                    
                    monthLabel.style.left = `${weekIndex * 16}px`;
                    monthsContainer.appendChild(monthLabel);
                    
                    lastMonth = currentMonth;
                    lastYear = currentYear; 
                }
                weekIndex++; 
            }
            
            // --- Logika pro dny (čtverečky) ---
            // const dateString = d.toISOString().split('T')[0];
	    const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
	
            const commits = commitData[dateString] || 0;

            const square = document.createElement('div');
            square.classList.add('day-square');
            square.title = `${commits} commit(s) on ${dateString}`; 

            // --- Logika pro dny (čtverečky) ---
            if (commits >= 1 && commits <= 2) {
                square.style.backgroundColor = '#005f7a'; // Temně modrá
            } else if (commits >= 3 && commits <= 5) {
                square.style.backgroundColor = '#00a3cc'; // Střední kyanová
            } else if (commits >= 6 && commits <= 9) {
                square.style.backgroundColor = 'var(--electric-blue)'; 
                square.style.boxShadow = 'var(--glow)'; // Svítivá kyanová
            } else if (commits >= 10) {
                // Fáze "Bílý trpaslík" pro masivní aktivitu
                square.style.backgroundColor = '#ffffff'; 
                square.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.9)'; 
            }

            graphContainer.appendChild(square);
            dayCounter++;
        }
    } catch (error) {
        console.error("Graf commitů se nepodařilo načíst:", error);
    }
}

renderGraph();