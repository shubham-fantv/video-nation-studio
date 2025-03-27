import { letterSpacing } from '@mui/system';

const styles = {
  mainPage: {
    // height: "100vh",
    position: 'relative',
    overflow: 'hidden',
    paddingLeft: '80px',
    paddingRight: '80px',
    '@media(max-width:767px)': {
      paddingLeft: '10px',
      paddingRight: '10px',
    },
  },

  containerStyle: {
    width: 'auto',
    // marginLeft: "100px",
    // marginRight: "95px",
    padding: '0px !important',

    '@media(max-width:767px)': {
      // marginLeft: '10px',
      // marginRight: '10px',
    },
  },
  middleSection: {
    margin: 'auto',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    height: '70vh',
    position: 'relative',

    '@media(max-width:767px)': {
      flexWrap: 'wrap',
      height: 'auto',
    },
  },

  middleLeftSection: {
    display: 'flex',
    paddingTop: '40px',
    flexDirection: 'column',
    paddingRight: '40px',

    '& h1': {
      color: '#1E1E1E',
      fontSize: '80px',
      fontWeight: '800',
      lineHeight: '80px',
      fontFamily: 'Bricolage Grotesque',
      textAlign: 'left',
      letterSpacing: '-0.04em',
      textTransform: 'uppercase',
    },

    '& h2': {
      color: '#1E1E1E',
      fontSize: '24px',
      fontFamily: 'Nohemi',
      fontWeight: '500',
      paddingTop: '20px',
      textAlign: 'left',
      lineHeight: '24px',
      letterSpacing: ' 0.15px',
    },
    '& p': {
      color: '#1E1E1E',
      fontFamily: 'Nohemi',
      fontSize: '20px',
      textAlign: 'left',
      fontWeight: '500',
      letterSpacing: '1px',
      lineHeight: '22px',
    },
    '& ul': {
      padding: '0',
      margin: '0',
      display: 'flex',
      gap: '10px',
      padding: '0px',
      margin: '0px',
      color: '#1E1E1E',
      fontFamily: 'Nohemi',
      fontSize: '24px',
      textAlign: 'left',
      fontWeight: '500',
      letterSpacing: '1px',
      lineHeight: '22px',
    },

    '& ul li': {
      display: 'list-item',
      listStylePosition: 'inside',
    },

    '& ul li:first-child': {
      listStyle: 'none',
    },

    '@media(max-width:767px)': {
      width: '100%',
      textAlign: 'center',
      '& h2': {
        color: '#1E1E1E',
        fontSize: '16px',
        fontFamily: 'Nohemi',
        fontWeight: '500',
        paddingBottom: '20px',
        textAlign: 'left',
        lineHeight: '19px',
        textAlign: 'center',
      },
      '& p': {
        fontSize: '15px',

        fontFamily: 'Nohemi',
        lineHeight: '23px',
        marginTop: '10px',
        margin: 'auto',
        textAlign: 'center',
        width: '100%',
      },
      '& h1': {
        fontSize: '44px',
        lineHeight: '48px',
        letterSpacing: '-1.76px',
        fontWeight: '800',
        lineHeight: 'normal',
        fontFamily: 'Bricolage Grotesque',
        textAlign: 'center',
        paddingBottom: '5px',
      },
      '& ul': {
        padding: '0',
        margin: '0',
        display: 'flex',
        // gap: '10px',
        padding: '0px',
        margin: '0px',
        color: '#1E1E1E',
        fontFamily: 'Nohemi',
        fontSize: '12px',
        textAlign: 'center',
        fontWeight: '500',
        letterSpacing: '1px',
        lineHeight: '22px',
      },
    },
  },

  middleRightSection: {
    display: 'flex',
    height: 'auto',
    justifyContent: 'center',
    flexGrow: 1,
    flex: 1,
    height: '70%',
    // backdropFilter: 'blur(36px)',
    // background: 'rgba(20, 20, 20, 0.4)',
    borderRadius: '50px',

    '@media(max-width:767px)': {
      width: '100%',
      // width: '296px',
      height: '261px',
      paddingTop: '6%',
      paddingRight: '15px',
      paddingLeft: '15px',
      marginTop: '10px',
      marginRight: '0px',
    },
  },
  btnContainer: {
    boxShadow: '0px 6px 12px 0px #1E1E1E1F',
    border: '1px solid #FFF',
    borderBottomColor: '#6B61FF',
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.16) 100%)',
    borderRadius: '40px',
    padding: '8px 20px',
    alignItems: 'center',
    textTransform: 'none',
    display: 'flex',
    cursor: 'default',

    '& button': {
      color: '#1E1E1E',
      fontWeight: '500',
      fontSize: '20px',
      textTransform: 'upercase',
      height: '100%',
      fontFamily: 'Nohemi',
      lineHeight: '24.11px',
      cursor: 'default',
      '@media(max-width:767px)': {
        textAlign: 'center',
        leadingTrim: 'both',
        textEdge: 'cap',
        fontSize: '14px',
      },
    },
    '& img': {
      height: '20px',
      width: '20px',
    },
    marginBottom: '30px',
  },
  labelContainer: {
    border: '1px solid rgba(107, 97, 255, 0.8)',
    backgroundColor: 'rgba(107, 97, 255, 0.8)',
    justifyContent: 'center',
    textTransform: 'none',
    display: 'flex',
    width: '100%',
    cursor: 'default',

    '& button': {
      color: '#ffff',
      padding: '8px 16px',
      fontWeight: '500',
      fontSize: '24px',
      textTransform: 'uppercase',
      height: '100%',
      fontFamily: 'Nohemi',
      lineHeight: '28.11px',
      cursor: 'default',
    },
    '@media(max-width:767px)': {
      '& button': {
        color: '#ffff',
        textAlign: 'center',
        fontWeight: '500',
        fontSize: '16px',
        textTransform: 'Capitalize',
        height: '100%',
        fontFamily: 'Nohemi',
      },
    },
    marginTop: '30px',
  },
};
export default styles;
