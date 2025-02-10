import toast from "react-hot-toast";

export enum FetchContext {
  title = 'title',
  departures = 'departures',
  arrivals = 'arrivals',
  train = 'train'
}

export class FetchError extends Error {
  status: number;
  context: FetchContext;

  constructor(message: string, status: number, context: FetchContext) {
    super(message);
    this.status = status;
    this.context = context;

    // Pour que l'instance de l'erreur ait bien le bon prototype
    Object.setPrototypeOf(this, FetchError.prototype);
  }
}

export const errorHandler = (error: unknown ) => {
  if (error instanceof FetchError) {
    switch (error.status) {
      case 401:
        toast.error("Une erreur est survenue. Veuillez réessayer demain.");
        break;
      case 404:
        if (error.context === FetchContext.title) {
          toast.error("La gare n'a pas été trouvée.");
        } else {
          toast.error("Une erreur est survenue.");
        }
        break;
      default:
        toast.error("Une erreur est survenue.");
        break;
    }
  }
}