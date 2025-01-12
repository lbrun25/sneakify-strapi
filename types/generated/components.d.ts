import type { Schema, Struct } from '@strapi/strapi';

export interface SharedAvis extends Struct.ComponentSchema {
  collectionName: 'components_shared_avis';
  info: {
    displayName: 'Avis';
  };
  attributes: {
    description: Schema.Attribute.Text;
    membre: Schema.Attribute.Component<'shared.member', false>;
  };
}

export interface SharedBadge extends Struct.ComponentSchema {
  collectionName: 'components_shared_badges';
  info: {
    description: '';
    displayName: 'Badge';
  };
  attributes: {
    hex_color: Schema.Attribute.String;
    label: Schema.Attribute.String;
    style: Schema.Attribute.Enumeration<['default', 'time_limit']>;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    description: '';
    displayName: 'Button';
  };
  attributes: {
    style: Schema.Attribute.Enumeration<['primary']>;
    url: Schema.Attribute.String;
  };
}

export interface SharedFooter extends Struct.ComponentSchema {
  collectionName: 'components_shared_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    cover: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SharedHeader extends Struct.ComponentSchema {
  collectionName: 'components_shared_headers';
  info: {
    description: '';
    displayName: 'Header';
  };
  attributes: {
    banners: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
  };
}

export interface SharedMember extends Struct.ComponentSchema {
  collectionName: 'components_shared_members';
  info: {
    description: '';
    displayName: 'Membre';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
  };
}

export interface SharedProduit extends Struct.ComponentSchema {
  collectionName: 'components_shared_produits';
  info: {
    displayName: 'Produit';
    icon: '';
  };
  attributes: {
    ordre: Schema.Attribute.Integer;
    produit: Schema.Attribute.Relation<'oneToOne', 'api::produit.produit'>;
  };
}

export interface SharedTag extends Struct.ComponentSchema {
  collectionName: 'components_shared_tags';
  info: {
    displayName: 'Tag';
  };
  attributes: {
    icon_name_mui: Schema.Attribute.String;
    label: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.avis': SharedAvis;
      'shared.badge': SharedBadge;
      'shared.button': SharedButton;
      'shared.footer': SharedFooter;
      'shared.header': SharedHeader;
      'shared.member': SharedMember;
      'shared.produit': SharedProduit;
      'shared.tag': SharedTag;
    }
  }
}
