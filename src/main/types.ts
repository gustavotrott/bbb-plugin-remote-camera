interface RemoteCameraPluginProps {
    pluginName: string,
    pluginUuid: string,
}

export { RemoteCameraPluginProps };

export interface UserMetadata {
    parameter: string;
    value: string;
}

export interface UserMetadataGraphqlResponse {
    user_metadata: UserMetadata[];
}
