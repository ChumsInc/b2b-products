import styled from "@emotion/styled";
import type {ReactNode, HTMLAttributes} from "react";

const ImageFilenameContainer = styled.div`
    white-space: nowrap;
`

const ImageFilenameContent = styled.div`
    font-size: 0.75rem;
    color: var(--bs-secondary-text-emphasis);
    text-overflow: ellipsis;
    overflow: hidden;
`

export type ImageFilenameProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode
}
export default function ImageFilename({children, ...rest}:ImageFilenameProps) {
    return (
        <ImageFilenameContainer {...rest}>
            <ImageFilenameContent>{children}</ImageFilenameContent>
        </ImageFilenameContainer>
    )
};
