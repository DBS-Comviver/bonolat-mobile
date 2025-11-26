declare module 'react-native' {
	import * as React from 'react';
	
	export type ViewStyle = {
		[key: string]: any;
	};
	
	export type TextStyle = {
		[key: string]: any;
	};
	
	export interface ViewProps {
		children?: React.ReactNode;
		style?: ViewStyle | ViewStyle[] | any;
		[key: string]: any;
	}
	
	export interface ScrollViewProps {
		children?: React.ReactNode;
		style?: ViewStyle | ViewStyle[] | any;
		[key: string]: any;
	}
	
	export interface TextInputProps {
		value?: string;
		onChangeText?: (text: string) => void;
		placeholder?: string;
		placeholderTextColor?: string;
		editable?: boolean;
		keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'decimal-pad';
		autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
		style?: ViewStyle | ViewStyle[] | any;
		className?: string;
		[key: string]: any;
	}
	
	export interface TouchableOpacityProps {
		children?: React.ReactNode;
		style?: ViewStyle | ViewStyle[] | any;
		[key: string]: any;
	}
	
	export interface ActivityIndicatorProps {
		color?: string;
		size?: 'small' | 'large' | number;
		style?: ViewStyle | ViewStyle[] | any;
		[key: string]: any;
	}
	
	export interface ModalProps {
		visible: boolean;
		children?: React.ReactNode;
		style?: ViewStyle | ViewStyle[] | any;
		animationType?: 'none' | 'slide' | 'fade';
		transparent?: boolean;
		[key: string]: any;
	}
	
	export interface TextProps {
		children?: React.ReactNode;
		style?: TextStyle | TextStyle[] | any;
		numberOfLines?: number;
		className?: string;
		[key: string]: any;
	}
	
	export interface ImageProps {
		source: any;
		style?: ViewStyle | ViewStyle[] | any;
		resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
		[key: string]: any;
	}
	
	export interface FlatListProps<ItemT> {
		data: ItemT[];
		renderItem: (info: { item: ItemT; index: number }) => React.ReactElement | null;
		keyExtractor?: (item: ItemT, index: number) => string;
		style?: ViewStyle | ViewStyle[] | any;
		[key: string]: any;
	}
	
	export type NativeSyntheticEvent<T> = {
		nativeEvent: T;
	};
	
	export type TextInputFocusEventData = {
		target: number;
		text: string;
	};
	
	export const View: React.ComponentType<ViewProps>;
	export const ScrollView: React.ComponentType<ScrollViewProps>;
	export const TextInput: React.ComponentType<TextInputProps>;
	export const TouchableOpacity: React.ComponentType<TouchableOpacityProps>;
	export const ActivityIndicator: React.ComponentType<ActivityIndicatorProps>;
	export const Modal: React.ComponentType<ModalProps>;
	export const Text: React.ComponentType<TextProps>;
	export const Image: React.ComponentType<ImageProps>;
	export const FlatList: <ItemT = any>(props: FlatListProps<ItemT>) => React.ReactElement;
	
	export const Alert: {
		alert: (title: string, message?: string, buttons?: any[]) => void;
	};
	
	export const Keyboard: {
		dismiss: () => void;
	};
	
	export const StyleSheet: {
		create: <T extends Record<string, ViewStyle | TextStyle>>(styles: T) => T;
		flatten: (style: ViewStyle | ViewStyle[] | any) => ViewStyle;
		absoluteFillObject: ViewStyle;
		hairlineWidth: number;
	};
	
	export const Appearance: {
		getColorScheme: () => 'light' | 'dark' | null;
		setColorScheme: (colorScheme: 'light' | 'dark' | null) => void;
		addChangeListener: (listener: (preferences: { colorScheme: 'light' | 'dark' | null }) => void) => { remove: () => void };
		removeChangeListener: (listener: (preferences: { colorScheme: 'light' | 'dark' | null }) => void) => void;
	};
	
	export const Platform: {
		OS: 'ios' | 'android' | 'windows' | 'macos' | 'web';
		Version: number | string;
		select: <T>(specifics: { ios?: T; android?: T; default?: T }) => T | undefined;
	};
	
	export function useColorScheme(): 'light' | 'dark' | null;
}

