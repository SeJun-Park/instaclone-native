export type LoggedOutStackNavParamList = {
    Welcome: undefined;
    LogIn: {
      username: string;
      password: string;
    };
    CreateAccount: undefined;
  };

  export type LoggedInTabNavParamList = {
    FeedTab: undefined;
    SearchTab: undefined;
    CameraTab: undefined;
    NotificationsTab: undefined;
    MeTab: undefined;
  };

  export type SharedStackNavParamList = {
    Feed: undefined;
    Search: undefined;
    Notifications: undefined;
    Me:undefined;
    Profile: {
      username:string;
    };
    Photo:{
      photoId: number;
    };
    Likes: {
      photoId:number;
    };
    Comments: {
      photoId:number;
    };
  };

  export type PhotoContainerNavParamList = {
    PhotoContainer: undefined;
    Profile: {
      id:number;
      username:string;
    };
    Likes: {
      photoId:number;
    };
    Comments: {
      photoId:number;
    };
  };
  // Photo (Component) 에서 갈 수 있는 화면 이름을 모두 정리.


  export type UserRowNavParamList = {
    UserRow: undefined;
    Profile: {
      id:number;
      username:string;
    };
  };


  ////////Me 


  export interface IMeData {
    me: {
        id:number;
        username:string;
        avatar?:string;
        // totalFollwers:number;
        // totalFollowings:number;
    }
}

  ////////////login////////////

export interface ILoginVar {
  username: string;
  password: string;
}

export interface ILoginData {
  login: {
      ok:boolean;
      token?:string;
      error?:string;
  }
}

///////////createAccount/////////

export interface ICreateAccountVar {
  email:string;
  firstName:string;
  lastName?:string;
  username:string;
  password:string;
}

export interface ICreateAccountData {
  createAccount: {
      ok:boolean;
      id?:number;
      error?:string;
  }
}

///////////seeFeed/////////

interface ISeeFeedUser {
  id:number;
  username: string;
  avatar?: string;
}

interface ISeeFeedComment {
  id:number;
  payload:string;
  user:ISeeFeedUser;
  isMine:boolean;
  createdAt:string;
}

interface ISeeFeedPhoto {
  id: number;
  user: ISeeFeedUser;
  file: string;
  caption?: string;
  comments: ISeeFeedComment[];
  totalLikes: number;
  totalComments: number;
  createdAt: string; // createdAt은 일반적으로 ISO 문자열입니다.
  isMine: boolean;
  isLiked: boolean;
}

interface ISeeFeedData {
  seeFeed: ISeeFeedPhoto[];
}

interface ISeeFeedVars {
  // myCursor?: number; --> web
  offset: number;
}

  
  //////toggleLike///////

  export interface IToggleLikeData {
    toggleLike: {
        ok:boolean;
        id?:number;
        error?:string;
    }
}

export interface IToggleLikeVar {
    photoId:number;
}

////////SeePhotoLikes

interface ISeePhotoLikesUser {
  id:number;
  username:string;
  avatar?:string;
  isFollowing:boolean;
  isMe:boolean;
}

interface ISeePhotoLikesData {
  seePhotoLikes: ISeePhotoLikesUser[];
}

interface ISeePhotoLikesVars {
  // myCursor?: number; --> web
  photoId:number;
  offset: number;
}

////////////SeeProfile

interface ISeeProfilePhoto {
  id:number;
  file:string;
  totalLikes:number;
  totalComments:number;
  isLiked:boolean;
}

interface ISeeProfileData {
  seeProfile: {
      id:number;
      username:string;
      firstName:string;
      lastName:string;
      avatar:string;
      bio:string;
      totalFollowers:number;
      totalFollowings:number;
      photos:ISeeProfilePhoto[];
      isMe:boolean;
      isFollowing:boolean;
  }
}

interface ISeeProfileVars {
  username:string;
  offset:number;
}

////////SearchUsers

interface ISearchUsersUser {
  id:number;
  username:string;
  avatar?:string;
  isFollowing:boolean;
  isMe:boolean;
}

interface ISearchUsersData {
  searchUsers: ISearchUsersUser[];
}

interface ISearchUsersVars {
  // myCursor?: number; --> web
  keyword:string;
  offset:number;
}


////////SearchPhotos

interface ISearchPhotosPhoto {
  id:number;
  file:string;
}

interface ISearchPhotosData {
  searchPhotos: ISearchPhotosPhoto[];
}

interface ISearchPhotosVars {
  // myCursor?: number; --> web
  keyword:string;
  offset:number;
}

///////////seePhoto/////////

interface ISeePhotoUser {
  id:number;
  username: string;
  avatar?: string;
}

interface ISeePhotoComment {
  id:number;
  payload:string;
  user:ISeePhotoUser;
  isMine:boolean;
  createdAt:string;
}

interface ISeePhotoPhoto {
  id: number;
  user: ISeePhotoUser;
  file: string;
  caption?: string;
  comments: ISeePhotoComment[];
  totalLikes: number;
  totalComments: number;
  createdAt: string; // createdAt은 일반적으로 ISO 문자열입니다.
  isMine: boolean;
  isLiked: boolean;
}

interface ISeePhotoData {
  seePhoto: ISeePhotoPhoto;
}

interface ISeePhotoVars {
  // myCursor?: number; --> web
  photoId: number;
}
