import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const TEASER_HTML_PATH = path.join(process.cwd(), 'components', 'app', 'teaser', 'teaser.html');

// Calculate current season
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth(); // 0-11
let seasonStartYear = currentYear;
if (currentMonth < 6) { // Before July
    seasonStartYear = currentYear - 1;
}
const seasonEndYear = seasonStartYear + 1;
const seasonString = `${seasonStartYear}-${String(seasonEndYear).slice(2)}`; // e.g., 2025-26

const FUPA_MATCHES_URL = `https://www.fupa.net/team/goyatzer-sv-m1-${seasonString}/matches`;
const FUSSBALL_DE_WIDGET_URL = 'https://www.fussball.de/widget2/-/schluessel/02H3P0U65S000000VS54898EVT1I90U6/target/widget/widget-table/show-main/false/show-tabelle/true/show-spielplan/false/show-turnier/false/show-wappen/true/show-header/false/show-footer/false/show-legende/false/show-navigation/false/show-info/false/show-titel/false';

async function fetchFootballData() {
  console.log(`Fetching data from fupa.net (${seasonString})...`);
  
  let lastGame = { score: '-:-', date: '', opponent: 'Gegner', opponentLogo: '' };
  let nextGame = { date: '', opponent: 'Gegner', opponentLogo: '' };
  let tableRank = '-';

  try {
    // 1. Fetch Matches from Fupa
    const response = await fetch(FUPA_MATCHES_URL);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const matchesMap = new Map();
    const matchLinks = document.querySelectorAll('a[href*="/match/"]');

    matchLinks.forEach(link => {
      const href = link.href;
      // Extract date from URL (last 6 digits: YYMMDD)
      const dateMatch = href.match(/-(\d{6})$/);
      
      if (dateMatch) {
        const dateStr = dateMatch[1];
        const year = '20' + dateStr.substring(0, 2);
        const month = dateStr.substring(2, 4);
        const day = dateStr.substring(4, 6);
        const date = new Date(`${year}-${month}-${day}`);
        
        // Extract text content to find opponent and score
        // Inject spaces between tags to prevent text merging
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = link.innerHTML.replace(/>/g, '> ').replace(/</g, ' <');
        let text = tempDiv.textContent || tempDiv.innerText;
        text = text.replace(/\s+/g, ' ').trim(); // Normalize whitespace

        // Extract logo if present
        // The logo might be inside a picture tag or just img
        // We look for an image that is NOT the Goyatzer SV logo (if possible to distinguish)
        // But usually there are two logos.
        // Let's grab all images.
        const images = link.querySelectorAll('img');
        let logoSrc = '';
        // Heuristic: The opponent logo is likely the one that doesn't have "Goyatzer" in alt text?
        // Or maybe just grab the second one if there are two?
        if (images.length >= 2) {
            // Assuming Home vs Away. We don't know which one is us without checking text.
            // But we can store both and decide later?
            // For now, let's just store the one that looks like a logo.
            // Fupa images are usually lazy loaded or have specific classes.
            // Let's just take the second one as a guess for "Opponent" if we are Home?
            // This is risky.
            // Let's try to find the one that is NOT Goyatzer.
            for (const img of images) {
                if (!img.alt.includes('Goyatzer') && !img.src.includes('placeholder')) {
                    logoSrc = img.src;
                    break;
                }
            }
        }

        // Deduplicate: keep the one with longest text (likely contains team names)
        if (!matchesMap.has(href) || text.length > matchesMap.get(href).text.length) {
            matchesMap.set(href, { date, text, href, logoSrc });
        }
      }
    });

    const matches = Array.from(matchesMap.values());

    // Sort matches by date
    matches.sort((a, b) => a.date - b.date);

    const today = new Date();
    // Reset time to midnight for accurate comparison
    today.setHours(0, 0, 0, 0);

    // Find Last Game (closest past date)
    const pastMatches = matches.filter(m => m.date < today);
    if (pastMatches.length > 0) {
      const lastMatch = pastMatches[pastMatches.length - 1];
      lastGame = parseMatchData(lastMatch, true);
    }

    // Find Next Game (closest future date, including today)
    const futureMatches = matches.filter(m => m.date >= today);
    if (futureMatches.length > 0) {
      const nextMatch = futureMatches[0];
      nextGame = parseMatchData(nextMatch, false);
    }

    // 2. Fetch Table Rank from Fussball.de (using the widget URL which is more reliable for rank)
    // If this fails, we default to '-'
    try {
        const rankResponse = await fetch(FUSSBALL_DE_WIDGET_URL);
        const rankJs = await rankResponse.text();
        
        // Extract HTML from document.write('...')
        // The content is usually inside document.write('...');
        // We need to be careful with escaping.
        const start = rankJs.indexOf("document.write('");
        const end = rankJs.lastIndexOf("');");
        
        if (start !== -1 && end !== -1) {
            let rankHtml = rankJs.substring(start + 16, end);
            // Unescape slashes and quotes if necessary
            rankHtml = rankHtml.replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\//g, '/');
            
            const rankDom = new JSDOM(rankHtml);
            const rankDoc = rankDom.window.document;
            
            // Look for the row containing "Goyatzer SV"
            const rows = rankDoc.querySelectorAll('tr');
            for (const row of rows) {
                if (row.textContent.includes('Goyatzer SV')) {
                    const rankCell = row.querySelector('.column-rank');
                    if (rankCell) {
                        tableRank = rankCell.textContent.trim();
                    } else {
                        // Fallback: first cell
                        const firstCell = row.querySelector('td');
                        if (firstCell) {
                            tableRank = firstCell.textContent.trim().replace('.', '');
                        }
                    }
                    break;
                }
            }
        }
    } catch (e) {
        console.error('Error fetching table rank:', e);
    }

    console.log('Final Data:', { lastGame, nextGame, tableRank });
    updateTeaserHtml(lastGame, nextGame, tableRank);

  } catch (error) {
    console.error('Error fetching football data:', error);
  }
}

function parseMatchData(match, isPast) {
    const result = {
        date: formatDate(match.date),
        opponent: 'Gegner',
        score: '-:-',
        opponentLogo: match.logoSrc || ''
    };

    // Clean text to find opponent
    // Remove "Goyatzer SV" (case insensitive)
    let cleanText = match.text.replace(/Goyatzer SV/gi, '').trim();
    
    // Try to extract score (e.g., "5 : 2" or "5 2")
    // Regex for score: \d+\s*[:]\s*\d+ or just \d+\s+\d+ at the end
    const scoreMatch = cleanText.match(/(\d+)\s*[:]?\s*(\d+)\s*$/);
    
    if (scoreMatch) {
        result.score = `${scoreMatch[1]}:${scoreMatch[2]}`;
        // Remove score from text to get opponent name
        cleanText = cleanText.replace(scoreMatch[0], '').trim();
    } else if (!isPast) {
        // For future games, look for time (e.g., "15:00")
        const timeMatch = cleanText.match(/(\d{2}:\d{2})/);
        if (timeMatch) {
            result.score = timeMatch[1]; // Display time instead of score
             // Remove time from text
             cleanText = cleanText.replace(timeMatch[0], '').trim();
        }
    }

    // Clean up opponent name
    // Remove "Abpfiff", "Halbzeit", etc. if present
    cleanText = cleanText.replace(/Abpfiff|Halbzeit|Verlegt|Ausfall/gi, '').trim();
    
    // Remove duplicate words (often happens in text extraction: "Team A Team A")
    const words = cleanText.split(' ');
    const uniqueWords = [...new Set(words)];
    // Heuristic: if the string is just a repetition, take half. 
    // But "SV Calau SV Calau" -> "SV Calau".
    // Let's try to detect exact repetition.
    if (cleanText.length > 0) {
        const half = cleanText.length / 2;
        const firstHalf = cleanText.substring(0, half).trim();
        const secondHalf = cleanText.substring(half).trim();
        if (firstHalf === secondHalf) {
            cleanText = firstHalf;
        }
    }
    
    result.opponent = cleanText || 'Gegner';

    return result;
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}.`;
}

function updateTeaserHtml(lastGame, nextGame, tableRank) {
  if (!fs.existsSync(TEASER_HTML_PATH)) {
    console.error(`File not found: ${TEASER_HTML_PATH}`);
    return;
  }

  let content = fs.readFileSync(TEASER_HTML_PATH, 'utf-8');
  
  // Improved HTML Structure
  // Using inline styles to ensure layout matches user request (max-width, no names, better height)
  const newHtml = `
<!-- FOOTBALL-DATA-START -->

<div class="football-teaser-wrapper" style="max-width: 1000px; margin: 5vh auto; padding: 0 20px;">
  <h3 style="text-align: center; margin-bottom: 40px;">Abteilung Fußball Herren</h3>
  
  <div class="newsteaser" style="display: flex; flex-wrap: wrap; gap: 30px; justify-content: center; align-items: stretch;">

    <!-- Last Game -->
    <div class="newsteaser-card" style="flex: 1; min-width: 300px; background: #fff; padding: 25px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); display: flex; flex-direction: column; justify-content: space-between; align-items: center; transition: transform 0.3s ease;">
      <div style="width: 100%;">
        <h4 style="margin-top: 0; margin-bottom: 25px; color: #333; font-size: 1.4rem; text-align: center;">Letztes Spiel</h4>
        
        <div class="game-score-row" style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 10px;">
          <!-- Home Logo -->
          <div class="team-logo" style="flex: 1; display: flex; justify-content: flex-end;">
            <img src="./assets/img/gsv-logo-removed.png" alt="Goyatzer SV" loading="lazy" style="height: 60px; width: auto; object-fit: contain;">
          </div>
          
          <!-- Score -->
          <div class="score-info" style="text-align: center; min-width: 80px;">
            <span style="font-size: 2.2rem; font-weight: 800; line-height: 1; color: #1e1e1e; display: block;">${lastGame.score}</span>
            <span style="font-size: 0.9rem; color: #888; margin-top: 5px; display: block;">${lastGame.date}</span>
          </div>
          
          <!-- Opponent Logo -->
          <div class="team-logo" style="flex: 1; display: flex; justify-content: flex-start;">
            ${lastGame.opponentLogo ? 
                `<img src="${lastGame.opponentLogo}" alt="${lastGame.opponent}" loading="lazy" style="height: 60px; width: auto; object-fit: contain;">` :
                `<svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity: 0.3;">
                  <path d="M12 2L4 5V11C4 16.55 7.4 21.74 12 23C16.6 21.74 20 16.55 20 11V5L12 2Z" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`
            }
          </div>
        </div>
      </div>

      <a href="https://www.fupa.net/team/goyatzer-sv-m1-${seasonString}/matches" target="_blank" class="secondary" style="width: 100%; margin-top: 20px; font-size: 1rem; padding: 12px; text-align: center; text-decoration: none; box-sizing: border-box; display: inline-block;">
        zum Spielbericht
      </a>
    </div>

    <!-- Next Game -->
    <div class="newsteaser-card" style="flex: 1; min-width: 300px; background: #fff; padding: 25px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); display: flex; flex-direction: column; justify-content: space-between; align-items: center; transition: transform 0.3s ease;">
      <div style="width: 100%;">
        <h4 style="margin-top: 0; margin-bottom: 25px; color: #333; font-size: 1.4rem; text-align: center;">Nächstes Spiel</h4>
        
        <div class="game-score-row" style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 10px;">
          <!-- Opponent Logo (Assuming Away for next game logic or just generic placement) -->
          <!-- Note: We don't know if Home/Away easily, so we place Opponent Left, GSV Right for variety or keep consistent? -->
          <!-- Let's keep consistent: GSV Left, Opponent Right for simplicity, or swap if we knew. -->
          <!-- User image showed Opponent Left for Next Game. Let's try to swap for variety if it's a future game? -->
          <!-- Actually, let's keep GSV on the right for "Next Game" to imply "We are waiting for them" or similar? -->
          <!-- User image had: Opponent (Left) - Time - GSV (Right). Let's mimic that. -->
          
          <div class="team-logo" style="flex: 1; display: flex; justify-content: flex-end;">
             ${nextGame.opponentLogo ? 
                `<img src="${nextGame.opponentLogo}" alt="${nextGame.opponent}" loading="lazy" style="height: 60px; width: auto; object-fit: contain;">` :
                `<svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity: 0.3;">
                  <path d="M12 2L4 5V11C4 16.55 7.4 21.74 12 23C16.6 21.74 20 16.55 20 11V5L12 2Z" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`
             }
          </div>
          
          <div class="score-info" style="text-align: center; min-width: 80px;">
            <span style="font-size: 2.2rem; font-weight: 800; line-height: 1; color: #1e1e1e; display: block;">${nextGame.score}</span>
            <span style="font-size: 0.9rem; color: #888; margin-top: 5px; display: block;">${nextGame.date}</span>
          </div>
          
          <div class="team-logo" style="flex: 1; display: flex; justify-content: flex-start;">
            <img src="./assets/img/gsv-logo-removed.png" alt="Goyatzer SV" loading="lazy" style="height: 60px; width: auto; object-fit: contain;">
          </div>
        </div>
      </div>

      <a href="https://www.fupa.net/team/goyatzer-sv-m1-${seasonString}/matches" target="_blank" class="secondary" style="width: 100%; margin-top: 20px; font-size: 1rem; padding: 12px; text-align: center; text-decoration: none; box-sizing: border-box; display: inline-block;">
        zum Vorbericht
      </a>
    </div>

    <!-- Table Rank -->
    <!-- Removed as per user request -->

  </div>
</div>

<!-- FOOTBALL-DATA-END -->
`;

  const regex = /<!-- FOOTBALL-DATA-START -->[\s\S]*?<!-- FOOTBALL-DATA-END -->/;
  if (regex.test(content)) {
    const updatedContent = content.replace(regex, newHtml);
    fs.writeFileSync(TEASER_HTML_PATH, updatedContent, 'utf-8');
    console.log('teaser.html updated successfully.');
  } else {
    console.error('Could not find FOOTBALL-DATA markers in teaser.html');
  }
}

fetchFootballData();
