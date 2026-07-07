import React from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import CustomHeader from '../components/CustomHeader';
import termsData from '../config/termsData';

const { width, height } = Dimensions.get('window');

// Renders a bullet: optional bold prefix + body text
const BulletItem = ({ bold, text }) => (
  <View style={styles.bulletRow}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.bulletText}>
      {bold ? <Text style={styles.bold}>{bold} </Text> : null}
      {text}
    </Text>
  </View>
);

// Recursively renders a content[] array
const renderContent = (content, nested = false) =>
  content.map((item, i) => {
    switch (item.type) {
      case 'para':
        return <Text key={i} style={styles.paragraph}>{item.text}</Text>;

      case 'bullet':
        return (
          <View key={i} style={nested ? styles.nestedBullet : undefined}>
            <BulletItem bold={item.bold} text={item.text} />
          </View>
        );

      case 'nested':
        return (
          <View key={i} style={styles.nestedGroup}>
            {renderContent(item.content, true)}
          </View>
        );

      case 'subsection':
        return (
          <View key={i} style={styles.subSection}>
            <Text style={styles.subSectionTitle}>{item.number} {item.title}</Text>
            {renderContent(item.content)}
          </View>
        );

      default:
        return null;
    }
  });

const TermsAndConditions = ({ navigation }) => (
  <View style={styles.container}>
    <CustomHeader title="Terms & Conditions" onBack={() => navigation.goBack()} />

    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

      {/* Meta info */}
      <View style={styles.metaBox}>
        <Text style={styles.metaText}>Effective Date: 15 May 2026</Text>
        <Text style={styles.metaText}>Version: 1.0 (Beta)</Text>
        <Text style={styles.metaText}>Operated by Pratikshit Gupta (operating as mATHLETICS)</Text>
      </View>

      {/* Sections — driven entirely by data */}
      {termsData.map(section => (
        <View key={section.number} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.number}. {section.title}</Text>
          {renderContent(section.content)}
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By using mATHLETICS, you agree to these Terms and Conditions.
        </Text>
      </View>

    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
    paddingTop: height * 0.05,
  },
  scrollContent: {
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.05,
  },
  metaBox: {
    borderLeftWidth: 3,
    borderLeftColor: '#4A90D9',
    paddingLeft: width * 0.04,
    marginBottom: height * 0.03,
    gap: 4,
  },
  metaText: {
    fontSize: width * 0.033,
    color: '#8A9BB5',
    lineHeight: 20,
  },
  section: {
    marginBottom: height * 0.03,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: height * 0.012,
    letterSpacing: 0.3,
  },
  subSection: {
    marginTop: height * 0.015,
    marginBottom: height * 0.01,
  },
  subSectionTitle: {
    fontSize: width * 0.038,
    fontWeight: '600',
    color: '#4A90D9',
    marginBottom: height * 0.008,
  },
  paragraph: {
    fontSize: width * 0.037,
    color: '#C8D3E0',
    lineHeight: 22,
    marginBottom: height * 0.01,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: height * 0.008,
    paddingLeft: width * 0.02,
  },
  bullet: {
    color: '#4A90D9',
    fontSize: width * 0.04,
    marginRight: width * 0.025,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontSize: width * 0.037,
    color: '#C8D3E0',
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nestedBullet: {
    paddingLeft: width * 0.04,
  },
  nestedGroup: {
    paddingLeft: width * 0.04,
  },
  footer: {
    marginTop: height * 0.02,
    paddingTop: height * 0.02,
    borderTopWidth: 1,
    borderTopColor: '#1E2D45',
    alignItems: 'center',
  },
  footerText: {
    fontSize: width * 0.033,
    color: '#8A9BB5',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default TermsAndConditions;
