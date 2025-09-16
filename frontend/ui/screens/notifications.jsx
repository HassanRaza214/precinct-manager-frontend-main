import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useState, useEffect, useContext} from 'react';
import {getNotifications} from '../../CRUD';
import UserContext from '../../UserContext';
import moment from 'moment';
import {Appbar, Card, Title, Paragraph} from 'react-native-paper';

const {width, height} = Dimensions.get('window');
import arrow from '../assets/left-arrow.png';

const NotificationsScreen = ({navigation}) => {
  const [notification, setNotification] = useState([]);
  const {pollingStation, precinctName} = useContext(UserContext);

  useEffect(() => {
    getNotifications(pollingStation).then(result => {
      const formattedData = result.map(notification => ({
        ...notification,
        time: moment(notification.dt).format('MMMM DD, YYYY'),
      }));
      setNotification(formattedData);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Notifications" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {notification.map(notification => (
          <Card key={notification.id} style={styles.notificationCard}>
            <Card.Content>
              <Paragraph style={styles.notificationTime}>
                {notification.time}
              </Paragraph>

              <Title style={styles.notificationTitle}>
                {notification.Title}
              </Title>
              <Paragraph style={styles.notificationBody}>
                {notification.Body}
              </Paragraph>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 10,
  },
  notificationCard: {
    marginBottom: 10,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  notificationBody: {
    fontSize: 16,
    marginTop: 5,
  },
  notificationTime: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 5,
  },
});

export default NotificationsScreen;
