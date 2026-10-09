import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface modalInfoProps {
  word: string;
  translation: string;
}

interface СontextProps {
  refresh: boolean;
  setRefresh: (value: boolean) => void;
  modalInfo: modalInfoProps;
  setModalInfo: (value: modalInfoProps) => void;
}

export const MyContext = createContext<СontextProps | null>(null);

export function Provider({ children }: { children: ReactNode }) {
  const [refresh, setRefresh] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<modalInfoProps>({
    word: "",
    translation: "",
  });

  return (
    <MyContext.Provider
      value={{ refresh, setRefresh, modalInfo, setModalInfo }}
    >
      {children}
    </MyContext.Provider>
  );
}
