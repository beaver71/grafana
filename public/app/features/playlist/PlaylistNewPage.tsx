import React, { FC } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { NavModel } from '@grafana/data';
import { locationService } from '@grafana/runtime';

import Page from 'app/core/components/Page/Page';
import { StoreState } from 'app/types';
import { GrafanaRouteComponentProps } from '../../core/navigation/types';
import { getNavModel } from 'app/core/selectors/navModel';
import { PlaylistForm } from './PlaylistForm';
import { createPlaylist } from './api';
import { Playlist } from './types';
import { usePlaylist } from './usePlaylist';

interface ConnectedProps {
  navModel: NavModel;
}

interface Props extends ConnectedProps, GrafanaRouteComponentProps {}

export const PlaylistNewPage: FC<Props> = ({ navModel }) => {
  const { playlist, loading } = usePlaylist();
  const onSubmit = async (playlist: Playlist) => {
    await createPlaylist(playlist);
    locationService.push('/playlists');
  };

  return (
    <Page navModel={navModel}>
      <Page.Contents isLoading={loading}>
        <div className="page-container page-body">
          <h3 className="page-sub-heading">New Playlist</h3>

          <p className="playlist-description">
            A playlist rotates through a pre-selected list of Dashboards. A Playlist can be a great way to build
            situational awareness, or just show off your metrics to your team or visitors.
          </p>

          <PlaylistForm onSubmit={onSubmit} playlist={playlist} />
        </div>
        <footer />
      </Page.Contents>
    </Page>
  );
};

const mapStateToProps: MapStateToProps<ConnectedProps, {}, StoreState> = (state: StoreState) => ({
  navModel: getNavModel(state.navIndex, 'playlists'),
});

export default connect(mapStateToProps)(PlaylistNewPage);
