const urlScores = 'https://api.jsonsilo.com/20a186d9-07dc-4481-8271-0b49d9e75de9';
const headers = {
    'Content-Type': 'application/json',
    'X-SILO-KEY': 'GdpDnsBxyGH5mLi3olp8VWu8OBMyQyjIKXGP6G576f',
}

export const getUser = () => {
    const userId = localStorage.getItem('userId');
    if (userId) return userId;
    else { localStorage.setItem('userId', crypto.randomUUID()); return localStorage.getItem('userId'); }
};

export const localScores = () => {
    const scoresData = localStorage.getItem('scores');
    return scoresData ? JSON.parse(scoresData) : [];
}

export const distantScores = async () => {
    console.log('Distant scores fetching...');
    
    try {
        const res = await fetch(urlScores, { method: 'GET', headers });
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching distant scores:', error);
        return [];
    }
}