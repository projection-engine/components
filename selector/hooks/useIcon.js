import React, {useMemo} from "react"
import Preview from "../../preview/Preview"
import FileSystem from "../../../project/utils/files/FileSystem"
import {Icon} from "@f-ui/core"

export default function useIcon({type, data}) {
    const previewPath = useMemo(() => {
        return window.fileSystem.path + FileSystem.sep + "previews" + FileSystem.sep + data.registryID + ".preview"
    }, [data.registryID])
    return useMemo(() => {
        switch (type) {
        case "mesh":
            return(
                <Preview
                    iconStyles={{fontSize: "2rem",}}
                    styles={{
                        objectFit: "cover",
                        width: "35px",
                        height: "35px",
                        borderRadius: "5px"
                    }}
                    path={previewPath}
                    fallbackIcon={"view_in_ar"}
                />
            )
        case "image":
            return(
                <Preview
                    iconStyles={{fontSize: "1.6rem",}}
                    styles={{
                        objectFit: "cover",
                        width: "35px",
                        height: "35px",
                        borderRadius: "5px"
                    }}
                    path={previewPath}
                    fallbackIcon={"image"}
                />
            )
        case "material":
            return(
                <Preview
                    iconStyles={{fontSize: "2rem",}}
                    styles={{
                        objectFit: "cover",
                        width: "35px",
                        height: "35px",
                        borderRadius: "5px"
                    }}
                    path={previewPath}
                    fallbackIcon={"texture"}
                />
            )
        case "script":
            return <Icon styles={{fontSize: "2rem", color: "var(--pj-color-secondary)"}}>javascript</Icon>
        default:
            return
        }
    }, [type, data])
}
 