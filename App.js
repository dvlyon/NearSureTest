import React from 'react'
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, View  } from 'react-native'
import { Image, ListItem, SearchBar } from 'react-native-elements'

export default class App extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			data: [],
			error: null,
			search: '',
			filter: []
		}
	}
	
	updateSearch = search => {
		this.setState({
			search: search
		}, () => {
			const filter = this.state.data.filter(item => {
				const itemData = item.strDrink.toUpperCase()
				const textData = search.toUpperCase()

				return itemData.indexOf(textData) > -1
			})
			
			this.setState({
				filter: filter
			})
		})
	}

	componentDidMount() {
		return fetch('http://www.thecocktaildb.com/api/json/v1/1/filter.php?g=Cocktail_glass')
		.then((response) => response.json())
		.then((responseJson) => {
			this.setState({	
				isLoading: false,
				data: responseJson.drinks
			})
		})
		.catch((error) => {
			console.error(error)
			this.setState({	
				error: true
			})
		})
	}
	
	renderHeader = () => {
		const { search } = this.state
		
		return (
			<SearchBar
				placeholder="Search..."
				onChangeText={this.updateSearch}
				value={search}
			/>
		)
	}

	render(){
		const { data, filter, isLoading, search } = this.state
		
		if (isLoading) {
			return (
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight
					}}
				>
					<ActivityIndicator/>
				</View>
			)
		}
		
		const renderData = search.length > 0 ? filter : data
		
		if (renderData.length > 0) {
			return (
				<View
					style={{
						flex: 1,
						paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight
					}}
				>
					<FlatList
						data={renderData}
						renderItem={({item}) => (
							<ListItem
								title={item.strDrink}
								rightElement={
									<Image
										source={{ uri: item.strDrinkThumb }}
										style={{ width: 200, height: 200 }}
										PlaceholderContent={<ActivityIndicator />}
									/>
								}
							/>
						)}
						keyExtractor={({idDrink}, index) => idDrink}
						ItemSeparatorComponent={() => (
							<View
								style={{
									height: 1,
									width: '90%',
									backgroundColor: '#CED0CE',
									marginLeft: '5%'
								}}
							/>
						)}
						ListHeaderComponent={this.renderHeader}
					/>
				</View>
			)
		}
		
		return (
			<View
				style={{
					flex: 1,
					paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight
				}}
			>
				<SearchBar
					placeholder="Search..."
					onChangeText={this.updateSearch}
					value={search}
				/>
				<Text>
					No results founds for: {search}
				</Text>
			</View>
		)
	}
}