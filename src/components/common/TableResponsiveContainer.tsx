import type {HTMLAttributes, ReactNode} from "react";
import styles from "./table-responsive.module.css";


export interface TableResponsiveContainerProps extends HTMLAttributes<HTMLDivElement>{
    children: ReactNode,
}
export default function TableResponsiveContainer({ children, ...rest }: TableResponsiveContainerProps) {
    return (
        <div className={styles.tableResponsiveContainer} {...rest}>
            <div className="size-responsive">
                {children}
            </div>
        </div>
    )
}
