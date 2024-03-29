import {
    Box,
    Button,
    Drawer,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    IconButton,
    Spacer,
    useBreakpointValue,
    useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { GoFileSubmodule } from "react-icons/go";
import { MdMenu } from "react-icons/md";
import { VscArrowLeft } from "react-icons/vsc";
import SettingsBtn from "./ActionButtons/SettingsBtn";
import Sidebar from "./Sidebar";

export default function Header() {
    const router = useRouter();
    const breakPt = useBreakpointValue({ base: "base", md: "md" });
    const { isOpen, onOpen, onClose } = useDisclosure();

    const action = () => {
        if (breakPt == "md") router.replace("/dashboard");
        else if (router.query.id) router.back();
    };

    return (
        <React.Fragment>
            <Box>
                <Button
                    leftIcon={breakPt == "md" ? <GoFileSubmodule /> : <VscArrowLeft />}
                    variant="ghost"
                    aria-label={"User settings"}
                    onClick={action}
                >
                    Cloud Browser
                </Button>
            </Box>
            <Spacer />
            <Box display={breakPt == "md" ? "block" : "none"}>
                <SettingsBtn />
                <Button
                    variant="ghost"
                    onClick={() => {
                        window.location.href = "/api/logout";
                    }}
                >
                    Logout
                </Button>
            </Box>
            <Box display={breakPt == "md" ? "none" : "block"}>
                <IconButton icon={<MdMenu />} aria-label={"menu"} onClick={onOpen} />
                <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent bgColor={"gray.900"} p="4">
                        <DrawerCloseButton />
                        <div className="pt-5">
                            <Sidebar directoryId={"root"} />
                        </div>
                    </DrawerContent>
                </Drawer>
            </Box>
        </React.Fragment>
    );
}
