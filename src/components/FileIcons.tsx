import { Icon } from "@chakra-ui/react";
import { FaFileVideo } from "react-icons/fa";
import { GoFile, GoFileDirectory } from "react-icons/go";

export default function FileIcon({ filename, mimeType }) {
    const chunks = filename.split(".");
    const ext = chunks[chunks.length - 1].toLowerCase();
    if (mimeType.endsWith("folder"))
        return <Icon as={GoFileDirectory} boxSize="6" verticalAlign={"bottom"} />;
    else {
        let icon = GoFile;
        if (ext === "mkv") icon = FaFileVideo;
        return <Icon as={icon} boxSize="6" verticalAlign={"bottom"} />;
    }
}