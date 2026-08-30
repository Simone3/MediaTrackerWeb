import { ReactElement, ReactNode, useEffect } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Dispatch } from 'redux';
import { AppError } from 'app/data/models/internal/error';
import { setError } from 'app/redux/actions/error/generators';
import { State } from 'app/redux/state/state';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens } from 'app/utilities/screens';

const homeScreenPath = screenToPath(AppScreens.CategoriesList);

/**
 * Centralized map between the app screens and the global context they need in order to render. No path carries an entity ID:
 * a route names a screen and the entity it works on comes from Redux, so a route opened directly (a bookmark, the browser
 * history, a shared link) can reach a screen whose data was never loaded. A screen that is missing from this map, like the
 * categories list, can always render.
 */
export const screenRequiredContext: { [screen: string]: (state: State) => boolean } = {
	[AppScreens.CategoryDetails]: (state) => {
		return Boolean(state.categoryDetails.category);
	},
	[AppScreens.MediaItemsList]: (state) => {
		return Boolean(state.categoryGlobal.selectedCategory);
	},
	[AppScreens.MediaItemDetails]: (state) => {
		return Boolean(state.categoryGlobal.selectedCategory) && Boolean(state.mediaItemDetails.mediaItem);
	},
	[AppScreens.GroupsList]: (state) => {
		return Boolean(state.categoryGlobal.selectedCategory);
	},
	[AppScreens.GroupDetails]: (state) => {
		return Boolean(state.categoryGlobal.selectedCategory) && Boolean(state.groupDetails.group);
	},
	[AppScreens.OwnPlatformsList]: (state) => {
		return Boolean(state.categoryGlobal.selectedCategory);
	},
	[AppScreens.OwnPlatformDetails]: (state) => {
		return Boolean(state.categoryGlobal.selectedCategory) && Boolean(state.ownPlatformDetails.ownPlatform);
	},
	[AppScreens.TvShowSeasonsList]: (state) => {
		return Boolean(state.mediaItemDetails.mediaItem);
	},
	[AppScreens.TvShowSeasonDetails]: (state) => {
		return Boolean(state.mediaItemDetails.mediaItem) && Boolean(state.tvShowSeasonDetails.tvShowSeason);
	}
};

/**
 * Tells if the given screen can render with the current global state
 * @param state the current state
 * @param screen the app screen
 * @returns true if the screen has everything it needs
 */
export const hasScreenRequiredContext = (state: State, screen: string): boolean => {
	const requiredContext = screenRequiredContext[screen];

	return requiredContext ? requiredContext(state) : true;
};

type ScreenContextGuardOwnProps = {

	/**
	 * The guarded app screen
	 */
	screen: string;

	/**
	 * The guarded screen component
	 */
	children?: ReactNode;
};

type ScreenContextGuardStateProps = {
	hasRequiredContext: boolean;
};

type ScreenContextGuardDispatchProps = {
	notifyMissingContext: () => void;
};

type ScreenContextGuardProps = ScreenContextGuardOwnProps & ScreenContextGuardStateProps & ScreenContextGuardDispatchProps;

const mapStateToProps = (state: State, ownProps: ScreenContextGuardOwnProps): ScreenContextGuardStateProps => {
	return {
		hasRequiredContext: hasScreenRequiredContext(state, ownProps.screen)
	};
};

const mapDispatchToProps = (dispatch: Dispatch): ScreenContextGuardDispatchProps => {
	return {
		notifyMissingContext: () => {
			dispatch(setError(AppError.SCREEN_CONTEXT_MISSING));
		}
	};
};

const ScreenContextGuardWrapperComponent = (props: ScreenContextGuardProps): ReactElement => {
	const {
		hasRequiredContext,
		notifyMissingContext,
		children
	} = props;

	// The redirect alone would look like the app ignored the URL, so the user gets the usual toast to explain it
	useEffect(() => {
		if(!hasRequiredContext) {
			notifyMissingContext();
		}
	}, [ hasRequiredContext, notifyMissingContext ]);

	if(!hasRequiredContext) {
		return <Navigate to={homeScreenPath} replace={true} />;
	}

	return <>{children}</>;
};

/**
 * Container component that keeps a screen from rendering without the global context it requires, sending the user to the
 * categories list instead. The redirect replaces the current history entry, so that browser back does not lead straight
 * back to the screen that cannot open.
 */
export const ScreenContextGuardContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ScreenContextGuardWrapperComponent);
