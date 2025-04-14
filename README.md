# react-uni-scrollbar
A React component to replace native browser scrollbars with customizable styles.

# use
npm install react-uni-scrollbar
import { UniScrollbar } from "react-uni-scrollbar";
import 'react-uni-scrollbar/dist/main.css'


    <UniScrollbar
        height={400}
        wraperStyle={{
        width: 300,
        }}
    >
        <ul>
        {Array.from({ length: 100 }).map((_, index) => (
            <li key={index}>
            UniScrollbar{index}UniScrollbar{index}UniScrollbar{index}
            UniScrollbar{index}UniScrollbar{index}UniScrollbar{index}
            </li>
        ))}
        </ul>
    </UniScrollbar>