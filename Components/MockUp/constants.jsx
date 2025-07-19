import SVG1 from '../../assets/Patterns/1.jsx';
import SVG2 from '../../assets/Patterns/2.jsx';
import SVG3 from '../../assets/Patterns/3.jsx';
import SVG4 from '../../assets/Patterns/4.jsx';
import SVG5 from '../../assets/Patterns/5.jsx';
import SVG6 from '../../assets/Patterns/6.jsx';
import SVG7 from '../../assets/Patterns/7.jsx';
import SVG8 from '../../assets/Patterns/8.jsx';
import SVG9 from '../../assets/Patterns/9.jsx';
import SVG10 from '../../assets/Patterns/10.jsx';


export const PATTERNS = [
  { id: 'p1', component: SVG1 },
  { id: 'p2', component: SVG2 },
  { id: 'p3', component: SVG3 },
  { id: 'p4', component: SVG4 },
  { id: 'p5', component: SVG5 },
  { id: 'p6', component: SVG6 },
  { id: 'p7', component: SVG7 },
  { id: 'p8', component: SVG8 },
  { id: 'p9', component: SVG9 },
  { id: 'p10', component: SVG10 },
];



export const MOCKUPS = [
    { id: 'mockup1', source: require('../../assets/MockUps/1.png') },
    { id: 'mockup2', source: require('../../assets/MockUps/2.png') },
    { id: 'mockup3', source: require('../../assets/MockUps/3.png') },
    { id: 'mockup4', source: require('../../assets/MockUps/4.png') },
    { id: 'mockup5', source: require('../../assets/MockUps/5.png') },
    { id: 'mockup6', source: require('../../assets/MockUps/6.png') },
];

// Helper function can also live here
export const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};