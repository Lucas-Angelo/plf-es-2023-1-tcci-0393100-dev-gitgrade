import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import Modal, { IModalProps } from "../../components/modal";

interface IModalContextData {
    dispatchModal: (
        content: React.ReactNode,
        options?: Omit<IModalProps, "children" | "isOpen" | "onClose">
    ) => void;
    isOpen: boolean;
    closeModal: () => void;
}

interface IModalProviderProps {
    children: React.ReactNode;
}

const modalContext = createContext<IModalContextData>({} as IModalContextData);

export default function ModalProvider(props: IModalProviderProps) {
    const [modalData, setModalData] =
        useState<Omit<IModalProps, "isOpen" | "onClose">>();
    const [isOpen, setIsOpen] = useState(false);

    const dispatchModal = useCallback(
        (
            content: React.ReactNode,
            options?: Omit<IModalProps, "children" | "isOpen" | "onClose">
        ) => {
            setModalData({
                ...options,
                children: content,
            });
            setIsOpen(true);
        },
        []
    );
    const closeModal = useCallback(() => {
        setIsOpen(false);
        setModalData(undefined);
    }, []);

    const contextValue = useMemo(
        () => ({
            dispatchModal,
            closeModal,
            isOpen,
        }),
        [dispatchModal, closeModal, isOpen]
    );

    return (
        <modalContext.Provider value={contextValue}>
            <Modal
                {...modalData}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
            {props.children}
        </modalContext.Provider>
    );
}

export function useModal() {
    return useContext(modalContext);
}
