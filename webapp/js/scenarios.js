/**
 * Pre-defined Scenarios
 * Based on real-world income distributions and tax systems
 */

class Scenarios {
    /**
     * Get scenario configuration
     * @param {string} scenarioName - Name of the scenario
     * @returns {object} - Scenario configuration
     */
    static getScenario(scenarioName) {
        const scenarios = {
            denmark: {
                name: 'Danmark',
                description: 'Dansk indkomstfordeling med progressiv skat',
                population: 200,
                groups: 10,
                groupSpan: 100000,
                distributionType: 'normal',
                taxBrackets: [
                    { threshold: 50000, rate: 8 },
                    { threshold: 200000, rate: 12 },
                    { threshold: 300000, rate: 15 },
                    { threshold: 999999, rate: 15 }
                ],
                expectedGini: 0.28
            },
            usa: {
                name: 'USA',
                description: 'Amerikansk indkomstfordeling med moderat skat',
                population: 200,
                groups: 10,
                groupSpan: 120000,
                distributionType: 'skewed',
                taxBrackets: [
                    { threshold: 80000, rate: 10 },
                    { threshold: 150000, rate: 12 },
                    { threshold: 250000, rate: 22 },
                    { threshold: 999999, rate: 24 }
                ],
                expectedGini: 0.41
            },
            sweden: {
                name: 'Sverige',
                description: 'Svensk indkomstfordeling med høj progressiv skat',
                population: 200,
                groups: 10,
                groupSpan: 95000,
                distributionType: 'normal',
                taxBrackets: [
                    { threshold: 45000, rate: 7 },
                    { threshold: 180000, rate: 13 },
                    { threshold: 320000, rate: 20 },
                    { threshold: 999999, rate: 25 }
                ],
                expectedGini: 0.27
            },
            equal: {
                name: 'Perfekt Lighed',
                description: 'Teoretisk perfekt ligelig fordeling',
                population: 200,
                groups: 10,
                groupSpan: 10000,
                distributionType: 'equal',
                taxBrackets: [
                    { threshold: 999999, rate: 0 }
                ],
                expectedGini: 0.00
            }
        };

        return scenarios[scenarioName] || scenarios.denmark;
    }

    /**
     * Convert tax brackets to array format for calculations
     * @param {Array} brackets - Array of bracket objects
     * @returns {number[]} - Flattened array [threshold1, rate1, threshold2, rate2, ...]
     */
    static bracketsToArray(brackets) {
        const arr = [];
        for (const bracket of brackets) {
            arr.push(bracket.threshold, bracket.rate);
        }
        return arr;
    }

    /**
     * Convert array format to bracket objects for UI
     * @param {number[]} arr - Flattened array
     * @returns {Array} - Array of bracket objects
     */
    static arrayToBrackets(arr) {
        const brackets = [];
        for (let i = 0; i < arr.length; i += 2) {
            brackets.push({
                threshold: arr[i],
                rate: arr[i + 1]
            });
        }
        return brackets;
    }

    /**
     * Get all available scenario names
     * @returns {string[]} - Array of scenario names
     */
    static getAllScenarioNames() {
        return ['denmark', 'usa', 'sweden', 'equal'];
    }

    /**
     * Get educational info about a country's tax system
     * @param {string} scenarioName - Name of scenario
     * @returns {string} - Educational description
     */
    static getEducationalInfo(scenarioName) {
        const info = {
            denmark: `
                <h4>Danmark 🇩🇰</h4>
                <p>Danmark har en af verdens mest ligelige indkomstfordelinger med en Gini-koefficient på ca. 0.28.</p>
                <ul>
                    <li><strong>Progressiv skat:</strong> Højere indkomster betaler en større andel</li>
                    <li><strong>Velfærdsstat:</strong> Høje skatter finansierer gratis sundhed og uddannelse</li>
                    <li><strong>Resultat:</strong> Lav ulighed og høj social mobilitet</li>
                </ul>
            `,
            usa: `
                <h4>USA 🇺🇸</h4>
                <p>USA har større indkomstulighed end de fleste udviklede lande med en Gini på ca. 0.41.</p>
                <ul>
                    <li><strong>Lavere skatter:</strong> Mindre omfordeling end i europæiske lande</li>
                    <li><strong>Markedsorienteret:</strong> Mindre statslig indgriben</li>
                    <li><strong>Resultat:</strong> Større ulighed men også højere økonomisk vækst</li>
                </ul>
            `,
            sweden: `
                <h4>Sverige 🇸🇪</h4>
                <p>Sverige har den laveste Gini-koefficient i verden på ca. 0.27.</p>
                <ul>
                    <li><strong>Meget progressiv skat:</strong> Stærk omfordeling</li>
                    <li><strong>Nordisk model:</strong> Kombination af markedsøkonomi og velfærd</li>
                    <li><strong>Resultat:</strong> Meget lav ulighed og høj livskvalitet</li>
                </ul>
            `,
            equal: `
                <h4>Perfekt Lighed ⚖️</h4>
                <p>Dette er et teoretisk scenarie hvor alle har præcis samme indkomst.</p>
                <ul>
                    <li><strong>Gini = 0.00:</strong> Ingen ulighed overhovedet</li>
                    <li><strong>Teoretisk:</strong> Eksisterer ikke i virkeligheden</li>
                    <li><strong>Diskussion:</strong> Er perfekt lighed ønskværdigt eller realistisk?</li>
                </ul>
            `
        };

        return info[scenarioName] || '';
    }
}

/**
 * Challenge Generator
 * Generates educational challenges for students
 */
class ChallengeGenerator {
    static challenges = [
        {
            id: 1,
            text: 'Hvorfor reducerer flad skat ikke Gini-koefficienten? Prøv selv og tænk over det!',
            check: (results) => true,
            hint: 'Flad skat bevarer relative forhold - hvis alle betaler 25%, har de rige stadig lige meget mere end de fattige'
        },
        {
            id: 2,
            text: 'Reducer uligheden med mindst 20% ved hjælp af progressiv beskatning',
            check: (results) => results.giniChangePercent > 20,
            hint: 'Brug flere skattetrin med stigende satser - fx 8%, 12%, 15%, 20%'
        },
        {
            id: 3,
            text: 'Skab en fordeling der ligner Danmarks: Gini omkring 0.28 efter skat',
            check: (results) => Math.abs(results.giniAfter - 0.28) < 0.03,
            hint: 'Brug en normal fordeling med moderat progressiv skat'
        },
        {
            id: 4,
            text: 'Eksperimenter: Sammenlign flad skat (25%) med progressiv skat - hvad er forskellen?',
            check: (results) => true,
            hint: 'Start med flad skat, noter Gini-ændringen, skift til progressiv og sammenlign'
        },
        {
            id: 5,
            text: 'Ekstrem progressivitet: Prøv at lave et system hvor de rigeste betaler 40% effektiv skat',
            check: (results) => true,
            hint: 'Brug mange skattetrin med høje satser for de højeste indkomster'
        },
        {
            id: 6,
            text: 'Hvad sker der hvis kun indkomst over 500,000 kr beskattes?',
            check: (results) => true,
            hint: 'Sæt første skattetrin til 500,000 kr med 0%, og derefter højere satser'
        }
    ];

    /**
     * Get a random challenge
     * @returns {object} - Challenge object
     */
    static getRandomChallenge() {
        const index = Math.floor(Math.random() * this.challenges.length);
        return this.challenges[index];
    }

    /**
     * Check if challenge is completed
     * @param {number} challengeId - Challenge ID
     * @param {object} results - Calculation results
     * @returns {boolean} - True if completed
     */
    static checkChallenge(challengeId, results) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        return challenge ? challenge.check(results) : false;
    }

    /**
     * Get hint for a challenge
     * @param {number} challengeId - Challenge ID
     * @returns {string} - Hint text
     */
    static getHint(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        return challenge ? challenge.hint : '';
    }
}
