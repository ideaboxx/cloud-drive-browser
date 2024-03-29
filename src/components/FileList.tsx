import { onUpdate } from "@/lib/uploadHandler";
import { formatDate, humanFileSize } from "@/lib/utils";
import { Data } from "@/types/data";
import { File } from "@/types/file";
import {
    Center,
    Checkbox,
    Spinner,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useBreakpointValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import FileIcon from "./FileIcons";
import FileListHeader from "./FileListHeader";
import If from "./If";

interface propType {
    folderId: string;
    onDirectoryChange: (folderId: string) => void;
}

export default function FileList({ folderId, onDirectoryChange }: propType) {
    const [data, setData] = useState<Data>();
    const [selection, setSelection] = useState<File[]>([]);
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();
    const breakPt = useBreakpointValue({ base: "base", md: "md" });

    const selectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked && data) {
            setSelection(data.files);
        } else {
            setSelection([]);
        }
    };

    const loadFiles = useCallback(
        async (folderId: string, silent = false) => {
            if (!silent) setLoading(true);
            onDirectoryChange(folderId);
            const { data } = await axios.post("/api/listFiles", { folderId });
            setData(data);
            setLoading(false);
        },
        [onDirectoryChange]
    );

    const checkbox = (e: React.ChangeEvent<HTMLInputElement>, file: File) => {
        if (e.target.checked) {
            setSelection([...selection, file]);
        } else {
            setSelection(selection.filter((s) => s.id != file.id));
        }
    };

    const reset = () => {
        setSelection([]);
        loadFiles(folderId);
    };

    const onFileClick = (file: { id: string; mimeType: string }) => {
        if (file.mimeType.includes("folder")) router.push(`/dashboard?id=${file.id}`);
        else window.location.href = `/api/download?id=${file.id}`;
    };

    useEffect(() => {
        setSelection([]);
        loadFiles(folderId);
        onUpdate((lastCompleted) => {
            if (lastCompleted.directoryId == folderId) {
                loadFiles(folderId, true);
            }
        });
    }, [folderId, loadFiles]);

    return (
        <>
            <If condition={breakPt == "base"}>
                <div>
                    <div className="flex justify-evenly">
                        {data && (
                            <FileListHeader
                                title={data.name}
                                fileCount={data.files.length}
                                isLoading={isLoading}
                                selection={selection}
                                folderId={folderId}
                                onRefresh={reset}
                                iconOnly={breakPt == "base"}
                            />
                        )}
                    </div>
                </div>
            </If>
            <div className="flex-1 h-full">
                <If condition={breakPt == "md"}>
                    {data && (
                        <FileListHeader
                            title={data.name}
                            fileCount={data.files.length}
                            isLoading={isLoading}
                            selection={selection}
                            folderId={folderId}
                            onRefresh={reset}
                            iconOnly={false}
                        />
                    )}
                </If>
                <If condition={isLoading}>
                    <Center py="4">
                        <Spinner />
                    </Center>
                </If>
                <TableContainer className="w-full px-2 mb-4 flex !overflow-y-auto fileListTable">
                    <Table variant="simple" display={isLoading ? "none" : "table"}>
                        <Thead>
                            <Tr>
                                <If condition={breakPt == "md"}>
                                    <Th w="4">
                                        <Checkbox
                                            colorScheme={"gray"}
                                            size={"lg"}
                                            onChange={selectAll}
                                        />
                                    </Th>
                                    <Th>Name</Th>
                                    <Th w="28">Date</Th>
                                    <Th w="28">Size</Th>
                                </If>
                                <If condition={breakPt == "base"}>
                                    <Th>
                                        <Checkbox
                                            colorScheme={"gray"}
                                            size={"lg"}
                                            onChange={selectAll}
                                        />
                                    </Th>
                                    <Th pl="0">{data && data.name}</Th>
                                </If>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data &&
                                data.files.map((f: File) => (
                                    <Tr
                                        key={f.id + f.modifiedTime}
                                        _hover={{ background: "gray.700" }}
                                    >
                                        <Td w="4">
                                            <Checkbox
                                                isChecked={
                                                    selection.findIndex((i) => i.id == f.id) > -1
                                                }
                                                colorScheme={"gray"}
                                                size={"lg"}
                                                onChange={(e) => checkbox(e, f)}
                                            />
                                        </Td>
                                        <If condition={breakPt == "md"}>
                                            <Td onClick={() => onFileClick(f)} cursor="pointer">
                                                <FileIcon mimeType={f.mimeType} filename={f.name} />
                                                <span className="ml-2">{f.name}</span>
                                            </Td>
                                            <Td>{formatDate(f.modifiedTime)}</Td>
                                            <Td>{f.size && humanFileSize(f.size)}</Td>
                                        </If>
                                        <If condition={breakPt == "base"}>
                                            <Td onClick={() => onFileClick(f)} pl="0">
                                                <FileIcon mimeType={f.mimeType} filename={f.name} />
                                                <span className="ml-2">{f.name}</span>
                                            </Td>
                                        </If>
                                    </Tr>
                                ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}
