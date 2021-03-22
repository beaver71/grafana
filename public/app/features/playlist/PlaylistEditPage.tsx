import React, { FC } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { NavModel } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { useStyles } from '@grafana/ui';

import Page from 'app/core/components/Page/Page';
import { StoreState } from 'app/types';
import { GrafanaRouteComponentProps } from '../../core/navigation/types';
import { getNavModel } from 'app/core/selectors/navModel';
import { PlaylistForm } from './PlaylistForm';
import { updatePlaylist } from './api';
import { Playlist } from './types';
import { usePlaylist } from './usePlaylist';
import { getPlaylistStyles } from './styles';

interface ConnectedProps {
  navModel: NavModel;
}

export interface RouteParams {
  id: number;
}

interface Props extends ConnectedProps, GrafanaRouteComponentProps<RouteParams> {}

export const PlaylistEditPage: FC<Props> = ({ navModel, match }) => {
  const styles = useStyles(getPlaylistStyles);
  const { playlist, loading } = usePlaylist(match.params.id);
  const onSubmit = async (playlist: Playlist) => {
    await updatePlaylist(match.params.id, playlist);
    locationService.push('/playlists');
  };

  return (
    <Page navModel={navModel}>
      <Page.Contents isLoading={loading}>
        <div className="page-container page-body">
          <h3 className={styles.subHeading}>Edit Playlist</h3>

          <p className={styles.description}>
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

export default connect(mapStateToProps)(PlaylistEditPage);
