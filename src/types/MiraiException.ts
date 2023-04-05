export class NetworkError extends Error {
	constructor(private where: string, private why?: string) {
		super();
	}

	toString(): string {
		return `Unable to connect to ${this.where}: ${this.why || '(no information provided)'}`;
	}
}

export class InvalidDataError extends Error {
	constructor(private what: string) {
		super();
	}

	toString(): string {
		return `Invalid data: ${this.what || '(no information provided)'}`;
	}
}

export class InvalidSessionError extends Error {
	toString(): string {
		return 'Session has expired or was not authenticated';
	}
}

export class RemoteFileNotFoundError extends Error {
	constructor(private where: string) {
		super();
	}

	toString(): string {
		return `File '${this.where}' not found (note: not present on mirai-api-http side, not this side)`;
	}
}

export class AccessDeniedError extends Error {
	constructor(private what?: string) {
		super();
	}

	toString(): string {
		return `Access denied ${this.what ? `for ${this.what}` : ''}`;
	}
}

export class NotImplementedError extends Error {
	toString(): string {
		return 'Method not implemented';
	}
}
