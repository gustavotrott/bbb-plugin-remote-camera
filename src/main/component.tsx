import * as React from 'react';
import { useEffect } from 'react';

import {
  ActionsBarButton, ActionsBarInterface, ActionsBarPosition,
  BbbPluginSdk, PluginApi,
} from 'bigbluebutton-html-plugin-sdk';
import { RemoteCameraPluginProps, UserMetadataGraphqlResponse } from './types';
import { ShareModal } from '../config-modal/modal';
import { USERS_METADATA } from './queries';

function RemoteCameraPlugin({
  pluginUuid: uuid,
}: RemoteCameraPluginProps): React.ReactNode {
  BbbPluginSdk.initialize(uuid);
  const pluginApi: PluginApi = BbbPluginSdk.getPluginApi(uuid);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [newJoinUrl, setNewJoinUrl] = React.useState(null);

  const userMetadataSubscription = pluginApi.useCustomSubscription<UserMetadataGraphqlResponse>(USERS_METADATA);
  const { data: userMetadata } = userMetadataSubscription;

  // Handle popup confirmation
  const getJoinUrlForCameraOnly = async () => {
    const joinUrl = await pluginApi.getJoinUrl({
      enforceLayout: 'CAMERAS_ONLY',
      'userdata-is_remote_camera': '1',
      'userdata-bbb_auto_share_webcam': 'true',
      'userdata-bbb_hide_controls': 'true',
      'userdata-bbb_auto_join_audio': 'false',
    });
    setNewJoinUrl(joinUrl);
  };

  // Toolbar button
  useEffect(() => {
    console.log('-----------------------------------');
    console.log(userMetadata);

    if (!userMetadata) return;

    userMetadata.user_metadata.forEach((currUserMetadata) => {
      console.log(currUserMetadata);
    });

    // eslint-disable-next-line array-callback-return
    const isRemoteCamera = userMetadata.user_metadata.filter((currUserMetadata) => {
      console.log(currUserMetadata);
      return currUserMetadata.parameter === 'is_remote_camera' && currUserMetadata.value === '1';
    });

    if (isRemoteCamera.length > 0) {
      // Hide buttons and non-local cameras
      const style = document.createElement('style');
      style.textContent = `
     #ActionsBar > div > div > * {
        display: none !important;
      }
    
    #layout #ActionsBar > div > div > div:has([data-test="joinVideo"]),
    #layout #ActionsBar > div > div > div:has([data-test="leaveVideo"]),
    #layout #ActionsBar > div > div > div:has([data-test="leaveVideo"]) > div {
      display: unset !important;
    }
    
    [data-test="leaveMeetingDropdown"], [data-test="optionsButton"] {
      display: none !important;
    }
    
    [data-test="webcamVideoItem"]:not(:has([data-local-stream="true"])) {
      display: none !important;
    }
    
    #cameraDock div div {
      grid-template-rows: none !important;
      grid-template-columns: none !important;
      height: 100% !important;
      width auto !important;
    }
    
    #cameraDock div div [data-test="webcamItem"] div:not(:has(video))  {
      display: none !important;
    }
  `;
      document.body.appendChild(style);

      return;
    }

    const buttonToActionsBar:
      ActionsBarInterface = new ActionsBarButton({
        icon: 'video',
        tooltip: 'Remote Camera',
        onClick: () => {
          setModalOpen(true);
        },
        position: ActionsBarPosition.LEFT,
      });

    pluginApi.setActionsBarItems([buttonToActionsBar]);

    getJoinUrlForCameraOnly();
  }, [userMetadata]);

  return (
    <ShareModal
      isOpen={isModalOpen}
      newJoinUrl={newJoinUrl}
      onClose={() => { setModalOpen(false); }}
    />
  );
}

export default RemoteCameraPlugin;
