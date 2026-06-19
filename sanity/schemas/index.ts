import type { SchemaTypeDefinition } from "sanity";

// Shared objects
import { richBody, inlineRichText } from "./objects/richBody";
import { youtube } from "./objects/youtube";
import { fileDownload } from "./objects/fileDownload";
import { personContact } from "./objects/personContact";

// Documents
import { person } from "./documents/person";
import { siteSettings } from "./documents/siteSettings";
import {
  programPage,
  proudPage,
  blogPage,
  uradPage,
  zapojteSePage,
} from "./documents/pages";
import { proudCategory, blogCategory, uradCategory } from "./documents/categories";
import { proudPost, blogPost, uradPost } from "./documents/posts";
import { legalPage } from "./legalPage";

export const schemaTypes: SchemaTypeDefinition[] = [
  // objects
  richBody,
  inlineRichText,
  youtube,
  fileDownload,
  personContact,
  // singletons
  siteSettings,
  programPage,
  proudPage,
  blogPage,
  uradPage,
  zapojteSePage,
  // categories
  proudCategory,
  blogCategory,
  uradCategory,
  // posts
  proudPost,
  blogPost,
  uradPost,
  // shared
  person,
  // legal
  legalPage,
];
